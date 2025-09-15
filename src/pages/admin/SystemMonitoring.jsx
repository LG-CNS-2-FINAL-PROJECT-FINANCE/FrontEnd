import React, { useMemo } from "react";
import PropTypes from "prop-types";

export default function SystemMonitoring({
    grafanaBaseUrl,
    dashboardUid,
    dashboardSlug = "",
    panelId,            // 있으면 d-solo(단일 패널), 없으면 대시보드 전체
    from = "now-24h",
    to = "now",
    orgId = 1,
    theme = "light",
    kiosk = false,
    height = 800,
}) {
    const src = useMemo(() => {
        const baseUrl = (grafanaBaseUrl || "http://13.124.228.130:3000/d/4dMaCsRZz/docker-container-and-host-metrics?orgId=1&var-interval=$__auto&from=now-15m&to=now&timezone=browser&var-job=containers&var-node=175.114.229.158&var-port=9201&var-Prod=$__all&var-NonProd=$__all&refresh=10s").replace(/\/+$/, "");

        const base = panelId
            ? `${baseUrl}/d-solo/${encodeURIComponent(dashboardUid)}/${encodeURIComponent(dashboardSlug)}`
            : `${baseUrl}/d/${encodeURIComponent(dashboardUid)}/${encodeURIComponent(dashboardSlug)}`;

        const params = new URLSearchParams({
            from,
            to,
            orgId: String(orgId),
            theme,
        });

        if (panelId) params.set("panelId", String(panelId));
        if (kiosk) params.set("kiosk", "tv"); // 또는 "1"

        return `${base}?${params.toString()}`;
    }, [grafanaBaseUrl, dashboardUid, dashboardSlug, panelId, from, to, orgId, theme, kiosk]);

    return (
        <iframe
            title="Grafana Dashboard"
            src={src}
            width="100%"
            height={height}
            frameBorder="0"
            referrerPolicy="no-referrer"
            loading="lazy"
            style={{ border: 0, borderRadius: 8, overflow: "hidden" }}
        // 필요 시 sandbox 조정:
        // sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
    );
}

SystemMonitoring.propTypes = {
    grafanaBaseUrl: PropTypes.string.isRequired, // e.g., "https://grafana.example.com"
    dashboardUid: PropTypes.string.isRequired,   // Grafana 대시보드 UID
    dashboardSlug: PropTypes.string,             // 옵션
    panelId: PropTypes.number,                   // 단일 패널 임베드 시
    from: PropTypes.string,
    to: PropTypes.string,
    orgId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    theme: PropTypes.oneOf(["light", "dark"]),
    kiosk: PropTypes.bool,
    height: PropTypes.number,
};
