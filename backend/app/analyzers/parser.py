import ast
from typing import Dict, Any, List


class CodeParser:

    def parse(self, code: str) -> Dict[str, Any]:
        if not code:
            return {
                "success": True,
                "line_counts": {"total": 0, "code": 0, "comment": 0, "blank": 0},
                "functions": [],
                "classes": [],
                "imports": [],
                "issues": []
            }

        clean_code = code.replace("\r\n", "\n").replace("\r", "\n").lstrip("\ufeff")
        lines = clean_code.splitlines()

        # Compute line counts
        total_lines = len(lines)
        blank_lines = sum(1 for l in lines if not l.strip())
        comment_lines = sum(1 for l in lines if l.strip().startswith("#"))
        code_lines = max(0, total_lines - blank_lines - comment_lines)

        line_counts = {
            "total": total_lines,
            "code": code_lines,
            "comment": comment_lines,
            "blank": blank_lines
        }

        try:
            tree = ast.parse(clean_code)
        except SyntaxError as e:
            return {
                "success": False,
                "line_counts": line_counts,
                "functions": [],
                "classes": [],
                "imports": [],
                "issues": [{
                    "line": e.lineno or 1,
                    "severity": "error",
                    "code": "SYNTAX_ERROR",
                    "message": f"Syntax error at line {e.lineno}: {e.msg}"
                }]
            }

        functions: List[Dict[str, Any]] = []
        classes: List[Dict[str, Any]] = []
        imports: List[Dict[str, Any]] = []
        issues: List[Dict[str, Any]] = []

        # Traverse AST nodes
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                arg_count = len(node.args.args)
                has_doc = ast.get_docstring(node) is not None

                functions.append({
                    "name": node.name,
                    "line": node.lineno,
                    "args_count": arg_count,
                    "is_async": isinstance(node, ast.AsyncFunctionDef),
                    "has_docstring": has_doc
                })

                if arg_count > 5:
                    issues.append({
                        "line": node.lineno,
                        "severity": "warning",
                        "code": "AST_TOO_MANY_ARGS",
                        "message": f"Function '{node.name}' has {arg_count} parameters (recommended <= 5)."
                    })

                if not has_doc and not node.name.startswith("__"):
                    issues.append({
                        "line": node.lineno,
                        "severity": "info",
                        "code": "AST_MISSING_DOCSTRING",
                        "message": f"Missing docstring in function '{node.name}'."
                    })

            elif isinstance(node, ast.ClassDef):
                method_count = sum(
                    1 for item in node.body if isinstance(item, (ast.FunctionDef, ast.AsyncFunctionDef))
                )
                base_names = [getattr(b, "id", getattr(b, "attr", "Base")) for b in node.bases]
                has_doc = ast.get_docstring(node) is not None

                classes.append({
                    "name": node.name,
                    "line": node.lineno,
                    "methods_count": method_count,
                    "bases": base_names,
                    "has_docstring": has_doc
                })

                if not has_doc:
                    issues.append({
                        "line": node.lineno,
                        "severity": "info",
                        "code": "AST_MISSING_CLASS_DOC",
                        "message": f"Missing docstring in class '{node.name}'."
                    })

            elif isinstance(node, ast.Import):
                for alias in node.names:
                    imports.append({
                        "module": alias.name,
                        "symbols": [alias.asname or alias.name],
                        "line": node.lineno
                    })

            elif isinstance(node, ast.ImportFrom):
                mod_name = node.module or ""
                symbols = [a.name for a in node.names]
                imports.append({
                    "module": mod_name,
                    "symbols": symbols,
                    "line": node.lineno
                })

        # Sort items by line number for clean presentation
        functions.sort(key=lambda x: x["line"])
        classes.sort(key=lambda x: x["line"])
        imports.sort(key=lambda x: x["line"])
        issues.sort(key=lambda x: x["line"])

        return {
            "success": True,
            "line_counts": line_counts,
            "functions": functions,
            "classes": classes,
            "imports": imports,
            "issues": issues
        }


code_parser = CodeParser()
