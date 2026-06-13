import React from 'react';
import { colors } from "../index";
import { useState, useEffect } from "react";
import si from "systeminformation";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";

const formatSpeed = bytes => {
    if (!bytes) return <Spinner type="dots"/>;
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
            <Box flexDirection="column" gap={1}>
                <Box justifyContent="space-between">
                    <Text color={colors.textSecondary}>Interface Name:</Text>
                    <Box>
                        {networkStats && <Text color={colors.textPrimary}>{networkStats.iface ?? <Spinner type="dots" />}</Text>}
                    </Box>
                </Box>
                <Box justifyContent="space-between">
                    <Text color={colors.textSecondary}>Download Speed:</Text>
                    <Box>
                        {networkStats && <Text color={colors.textPrimary}>{formatSpeed(networkStats.rx_sec)}</Text>}
                    </Box>
                </Box>
                <Box justifyContent="space-between">
                    <Text color={colors.textSecondary}>Upload Speed:</Text>
                    <Box>
                        {networkStats && <Text color={colors.textPrimary}>{formatSpeed(networkStats.tx_sec)}</Text>}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}