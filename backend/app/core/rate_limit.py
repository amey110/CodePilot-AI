from fastapi import Request
from slowapi.util import get_remote_address


def get_client_ip(request: Request) -> str:
    """
    Extract the real client IP address for rate limiting when running behind
    reverse proxies (Render, AWS ALB, Cloudflare, Nginx, etc.).
    
    Checks X-Forwarded-For (taking the leftmost client IP), then X-Real-IP,
    and falls back to slowapi's default get_remote_address / request.client.host.
    """
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        # X-Forwarded-For can be a comma-separated list: <client>, <proxy1>, <proxy2>
        client_ip = forwarded_for.split(",")[0].strip()
        if client_ip:
            return client_ip

    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        client_ip = real_ip.strip()
        if client_ip:
            return client_ip

    try:
        return get_remote_address(request)
    except Exception:
        if request.client and request.client.host:
            return request.client.host
        return "127.0.0.1"
