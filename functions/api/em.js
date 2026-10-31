export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
};

export const onRequestGet = async ({ request }) => {
  const url = new URL(request.url);
  const target = url.searchParams.get("target");

  if (!target || !/^https:\/\/push2(dec)?\.eastmoney\.com/.test(target)) {
    return new Response(JSON.stringify({ error: "非法目标地址" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const upstream = new Request(target, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
        "Referer": "https://quote.eastmoney.com/",
        "Origin": "https://quote.eastmoney.com",
      },
    });
    const resp = await fetch(upstream);
    const body = await resp.text();
    return new Response(body, {
      status: resp.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "东财网关失败", detail: String(e) }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};
