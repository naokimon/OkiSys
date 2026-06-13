import React from 'react';
import { colors } from "../index";
import { useState, useEffect } from "react";
import os from "os";
import si from "systeminformation";
import { Box, Text } from "ink";

export const SystemInfo = () => {
    const cpus = os.cpus();
    const [storage, setStorage] = useState(null);
    const [ramInfo, setRamInfo] = useState(null);
    const [gpu, setGpu] = useState(null);

    useEffect(() => {
        si.graphics().then(data => {
            const controller = data.controllers?.[0];
            if (!controller) return;
            setGpu({
                model: controller.model,
                vram: (controller.vram / 1024).toFixed(1),
                driver: controller.driverVersion ?? "None",
            });
        }).catch(() => {});

        si.memLayout().then(mem => {
            if (!mem?.[0]) return;
            setRamInfo({
                memory: (os.totalmem() / 1e9).toFixed(1),
                type: mem[0].type,
                speed: mem[0].clockSpeed,
                slots: mem.length
            });
        }).catch(() => {});

        si.fsSize().then(drives => {
            const isWindows = os.platform() === 'win32';
            const rootFs = isWindows ? "C:" : "/";
            const drive = drives.find(d => d.fs === rootFs) ?? drives[0];
            setStorage(drive ? `${((drive.size - drive.used) / 1e9).toFixed(1)}/${(drive.size / 1e9).toFixed(1)} GB` : "N/A");
        }).catch(() => {});
    }, []);

    return (
        <Box flexDirection="column" paddingY={1} paddingX={2} flexGrow={1}>
            <Box marginBottom={1} borderStyle="single" borderBottom={true} borderTop={false} borderLeft={false} borderRight={false} borderColor={colors.border}>
                <Text bold color={colors.brand}>System Specs</Text>
            </Box>
            <Box flexDirection="column" gap={1}>
                {[
                    { label: "CPU", value: cpus[0].model },
                    { label: "CPU Cores", value: `${cpus.length} cores` },
                    { label: "GPU", value: gpu?.model ?? "Loading..." },
                    { label: "GPU VRAM", value: gpu?.vram ? `${gpu.vram} GB` : "Loading..." },
                    { label: "GPU Driver", value: gpu?.driver ?? "Loading..." },
                    { label: "Total RAM", value: `${ramInfo?.memory ?? "Loading..."} GB` },
                    { label: "RAM Type", value: ramInfo?.type ?? "Loading..." },
                    { label: "RAM Speed", value: ramInfo ? `${ramInfo.speed} MHz` : "Loading..." },
                    { label: "RAM Slots", value: ramInfo ? `${ramInfo.slots} slots used` : "Loading..." },
                    { label: "Storage", value: storage ?? "Loading..." },
                    { label: "OS", value: `${os.type()} ${os.release()}` },
                    { label: "Host", value: os.hostname() },
                    { label: "Arch", value: os.arch() },
                ].map(({ label, value }) => (
                    <Box key={label} width="100%" justifyContent="space-between">
                        <Text color={colors.muted}>{label}:</Text>
                        <Text color={colors.textPrimary}>{value}</Text>
                    </Box>
                ))}
            </Box>
        </Box>
    )
};
