import React from 'react';
import { useState, useEffect } from 'react';
import { colors } from "../index";
import TextInput from 'ink-text-input';
import { Text, Box, useInput } from "ink";
import open from 'open';
import useSize from "../index";
import { writeFileSync, existsSync, appendFileSync, readFileSync } from 'fs';

const runCommand = async (rawCMD) => {
    if (!existsSync("commandlog.txt")) {
        writeFileSync('commandlog.txt', '');
    }
    appendFileSync('commandlog.txt', `\n${rawCMD}`);
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
        default:
            return [`${cmd} is not a valid command!`, colors.textPrimary];
            break;
    }
};

export const CommandInput = () => {
    const [value, setValue] = useState('');
    const [error, setError] = useState();
    const [resultColor, setResultColor] = useState(null);
    const [commandList, setCommandList] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const handleSubmit = async () => {
        const rawCMD = value.trim().toLowerCase();
        const result = await runCommand(rawCMD);
        await setError(result[0]);
        await setResultColor(result[1]);
        setValue('');
    };

    useEffect(() => {
        if (existsSync('commandlog.txt')) {
            const lines = readFileSync('commandlog.txt', 'utf-8').split('\n').filter(Boolean);
            setCommandList(lines);
            setHistoryIndex(lines.length);
        }
    }, []);

    useInput((input, key) => {
        if (commandList.length === 0) return;

        if (key.upArrow) {
            const i = Math.max(0, historyIndex - 1);
            setHistoryIndex(i);
            setValue(commandList[i]);
            if (commandList[i] !== undefined) setValue(commandList[i]);
            else setValue('');
        } else if (key.downArrow) {
            const i = Math.min(commandList.length - 1, historyIndex + 1);
            setHistoryIndex(i);
            setValue(commandList[i]);
            if (commandList[i] !== undefined) setValue(commandList[i]);
            else setValue('');
        }
    });

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