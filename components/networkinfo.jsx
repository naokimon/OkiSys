import React from 'react';
import { colors } from "../index";
import { useState, useEffect } from "react";
import si from "systeminformation";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";

const formatSpeed = bytes => {
    if (!bytes) return <Spinner type="dots" />;
    if (bytes < 1024) return `${bytes.toFixed(1)} B/s`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB/s`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB/s`;
}

export const NetworkInfo = () => {
    const [networkStats, setNetworkStats] = useState({ rx_sec: 0, tx_sec: 0 });
    const [networkInterface, setNetworkInterface] = useState(null);
    const [latency, setLatency] = useState(null);
    const refreshRate = 5000;

    useEffect(() => {
        si.networkInterfaces().then(data => setNetworkInterface(data[0]));

        const poll = () => {
            si.networkStats().then(data => setNetworkStats(data[0]));
            si.inetLatency().then(data => setLatency(data));
        };
        poll();
        const refresh = setInterval(poll, refreshRate);
        return () => clearInterval(refresh);
    }, []);

    return (
        <Box flexDirection="column" paddingY={1} paddingX={2} flexGrow={1}>
            <Box marginBottom={1} borderStyle="single" borderBottom={true} borderTop={false} borderLeft={false} borderRight={false} borderColor={colors.border}>
                <Text bold color={colors.brand}>Network Info</Text>
            </Box>
            <Box flexDirection="row" gap={6}>
                <Box flexDirection="column" gap={1}>
                    <Text bold color={colors.brandLight}>Interface</Text>
                    <Box justifyContent="space-between" gap={2}>
                        <Text color={colors.textSecondary}>Name:</Text>
                        {networkStats && <Text color={colors.textPrimary}>{networkStats.iface ?? <Spinner type="dots" />}</Text>}
                    </Box>
                    <Box justifyContent="space-between" gap={2}>
                        <Text color={colors.textSecondary}>Type:</Text>
                        {networkInterface && <Text color={colors.textPrimary}>{networkInterface.type}</Text>}
                    </Box>
                    <Box justifyContent="space-between" gap={2}>
                        <Text color={colors.textSecondary}>IPv4:</Text>
                        {networkInterface && <Text color={colors.textPrimary}>{networkInterface.ip4}</Text>}
                    </Box>
                    <Box justifyContent="space-between" gap={2}>
                        <Text color={colors.textSecondary}>Status:</Text>
                        <Text backgroundColor={networkInterface === null ? colors.warning : (networkInterface.operstate === 'up' ? colors.success : colors.error)}>
                            {"  "}
                        </Text>
                    </Box>
                </Box>

                <Box flexDirection="column" gap={1}>
                    <Text bold color={colors.brand}>Stats</Text>
                    <Box justifyContent="space-between" gap={2}>
                        <Text color={colors.textSecondary}>Download:</Text>
                        {networkStats && <Text color={colors.textPrimary}>{formatSpeed(networkStats.rx_sec)}</Text>}
                    </Box>
                    <Box justifyContent="space-between" gap={2}>
                        <Text color={colors.textSecondary}>Upload:</Text>
                        {networkStats && <Text color={colors.textPrimary}>{formatSpeed(networkStats.tx_sec)}</Text>}
                    </Box>
                </Box>

                <Box flexDirection="column" gap={1}>
                    <Text bold color={colors.brand}>Ping</Text>
                    <Box justifyContent="space-between" gap={2}>
                        <Text color={colors.textPrimary}>{latency === null ? <Spinner type="dots"/> : `${latency}ms`}</Text>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}