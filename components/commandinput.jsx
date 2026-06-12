import React from 'react';
import { useState } from 'react';
import { colors } from "../index";
import TextInput from 'ink-text-input';
import { Text, Box } from "ink";
import open from 'open';
import useSize from "../index";

const runCommand = async (rawCMD) => {
    const i = rawCMD.indexOf(" ");
    const cmd = i === -1 ? rawCMD : rawCMD.slice(0, i);
    const args = i === -1 ? [] : rawCMD.slice(i + 1).split(" ");
    
    switch (cmd) {
        case "exit":
            process.exit(0);
            break;
        case "goto":
            try {
                let url = args[0];
                if (!url.includes("https://")) {
                    url = "https://" + url;
                }
                open(url);
                return [`Trying ${url}`, colors.success];
                break;
            } catch (e) {
                return [e.message, colors.error];
                break;
            }
        case "github":
            let username = args[0];
            const res = await fetch(`https://github.com/${username}`);
            if (res.status === 404) {
                return [`${username} doesn't exist!`, colors.error];
                break;
            } else if (res.status === 200) {
                open(`https://github.com/${username}`);
                return [`Opening ${username}'s profile!`, colors.success];
                break;
            } else {
                return [res.status, colors.error];
                break;
            }
        case "refresh":
            process.stdout.rows = process.stdout.rows;
            process.stdout.columns = process.stdout.columns;
            return [`Succesfully refreshed!`, colors.success];
            break;
        default:
            return [`${cmd} is not a valid command!`, colors.textPrimary];
            break;
    }
};

export const CommandInput = () => {
    const [value, setValue] = useState('');
    const [error, setError] = useState();
    const [resultColor, setResultColor] = useState(null);

    const handleSubmit = async () => {
        const rawCMD = value.trim().toLowerCase();
        const result = await runCommand(rawCMD);
        await setError(result[0]);
        await setResultColor(result[1]);
        setValue('');
    };

    const size = useSize();

    return (
        <Box flexDirection="column">
            <Box paddingX={2}>
                <Text color={resultColor}>{error}</Text>
            </Box>
            <Box width={size.cols} borderStyle="round" borderColor={colors.border} paddingY={1.5} paddingX={2}>
                <TextInput color={colors.textPrimary} placeholderColor={colors.muted} value={value} onChange={setValue} onSubmit={handleSubmit} placeholder="Enter a command..." />
            </Box>
        </Box>
    )
};