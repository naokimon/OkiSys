import React from 'react';
import { colors } from "../index";
import { useState, useEffect } from "react";
import si from "systeminformation";
import { Box, Text } from "ink";

export const PerformanceInfo = () => {
    const [ramUsage, setRamUsage] = useState(null);
    const [cpuUsage, setCpuUsage] = useState(null);
    const [gpuUsage, setGpuUsage] = useState(null);
    const refreshRate = 5000;


    useEffect(() => {
        const poll = () => {
            si.mem().then(data => {
                if (!data) return;
                setRamUsage((data.used / data.total * 100).toFixed(0));
            });
            si.currentLoad().then(data => setCpuUsage(data.currentLoad.toFixed(0)));
            si.graphics().then(data => setGpuUsage(data.controllers[0].utilizationGpu ?? 0));
        };
        poll();
        const refresh = setInterval(poll, refreshRate);
        return () => clearInterval(refresh);
    }, []);

    const bar = (pct, width = 25) => {
        const filled = Math.round((pct / 100) * width);
        return "[" + "#".repeat(filled) + "-".repeat(width - filled) + "]";
    }

    const barColor = (pct) => {
        if (pct >= 90) return colors.error;
        if (pct >= 60) return colors.warning;
        return colors.success;
    }

    return (
        <Box flexDirection="column" paddingY={1} paddingX={2}>
            <Box marginBottom={1} borderStyle="single" borderBottom={true} borderTop={false} borderLeft={false} borderRight={false} borderColor={colors.border}>
                <Text bold color={colors.brand}>Performance Info</Text>
            </Box>
            <Box flexDirection="column" gap={1}>
                <Box flexDirection="column" gap={1}>
                    <Text color={colors.textSecondary}>RAM Usage:</Text>
                    <Box>
                        <Text color={barColor(ramUsage)}>{bar(ramUsage)} {(ramUsage)}%</Text>
                    </Box>
                </Box>
                <Box flexDirection="column" gap={1}>
                    <Text color={colors.textSecondary}>CPU Usage:</Text>
                    <Box>
                        <Text color={barColor(cpuUsage)}>{bar(cpuUsage)} {(cpuUsage)}%</Text>
                    </Box>
                </Box>
                <Box flexDirection="column" gap={1}>
                    <Text color={colors.textSecondary}>GPU Usage:</Text>
                    <Box>
                        <Text color={barColor(gpuUsage)}>{bar(gpuUsage)} {gpuUsage}%</Text>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}