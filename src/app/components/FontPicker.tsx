"use client";

import React, { useEffect, useState } from "react";
import {
    ActionIcon,
    Button,
    Combobox,
    ComboboxChevron,
    ComboboxDropdown,
    ComboboxOption,
    ComboboxOptions,
    ComboboxTarget,
    InputBase,
    ScrollArea,
    TextInput,
    useCombobox,
} from "@mantine/core";
import axios from "axios";
import { IconExternalLink, IconSearch, IconX } from "@tabler/icons-react";


const FONT_LIMIT = 10;

export const FontPicker = () => {
    const [fonts, setFonts] = useState([]);
    const [filteredFonts, setFilteredFonts] = useState([]);
    const [selectedFont, setSelectedFont] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [limit, setLimit] = useState(FONT_LIMIT);

    const combobox = useCombobox();

    useEffect(() => {
        const apiKey = "";
        axios.get(`https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`)
            .then(response => {
                const fontFamilies = response.data.items.map(font => font.family);
                setFonts(fontFamilies);
                setFilteredFonts(fontFamilies);
                setSelectedFont(fontFamilies[0]);
            })
            .catch(error => console.error('Error fetching fonts:', error));
    }, []);

    useEffect(() => {
        const filtered = fonts.filter(font =>
            font.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredFonts(filtered);
    }, [searchQuery, fonts]);

    const loadMoreFonts = () => {
        setLimit(prevLimit => prevLimit + FONT_LIMIT);
    };

    const getFontLink = (font) => {
        return `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}&display=swap`;
    };

    const applyFontStyle = (font) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = getFontLink(font);
        document.head.appendChild(link);
    };

    const handleFontSelection = (font) => {
        setSelectedFont(font);
        applyFontStyle(font);
    };

    const fontOptions = filteredFonts.slice(0, limit).map(font => (
        <ComboboxOption
            key={font}
            value={font}
            onClick={() => handleFontSelection(font)}
            style={{ fontFamily: font }}
        >
            {font}
        </ComboboxOption>
    ));

    return (
        <div>
            <Combobox
                store={combobox}
                position="bottom-start"
                offset={0}
                radius={0}
                shadow="xl"
                withinPortal={false}
                transitionProps={{
                    duration: 250,
                    exitDuration: 150,
                    transition: "pop",
                }}
                classNames={{
                    dropdown: "p-0",
                    option: "py-2 px-4 text-[1rem]",
                }}
            >
                <ComboboxTarget>
                    <InputBase
                        component="button"
                        type="button"
                        label="Select a font"
                        pointer
                        rightSection={<ComboboxChevron />}
                        onClick={() => combobox.toggleDropdown()}
                        rightSectionPointerEvents="none"
                        multiline
                    >
                        {selectedFont ? (
                            <div
                                className="text-[1rem]"
                                style={{ fontFamily: selectedFont }}
                            >
                                {selectedFont}
                            </div>
                        ) : (
                            <div>Select a font</div>
                        )}
                    </InputBase>
                </ComboboxTarget>
                <ComboboxDropdown>
                    <div className="bg-primary-50 p-2.5">
                        <TextInput
                            type="text"
                            className="w-full"
                            placeholder="Search"
                            value={searchQuery}
                            rightSection={
                                searchQuery ? (
                                    <ActionIcon
                                        variant="subtle"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setLimit(FONT_LIMIT);
                                        }}
                                    >
                                        <IconX size={18} />
                                    </ActionIcon>
                                ) : (
                                    <IconSearch size={18} />
                                )
                            }
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setLimit(FONT_LIMIT);
                            }}
                        />
                    </div>
                    <ComboboxOptions>
                        <ScrollArea.Autosize
                            type="scroll"
                            mah={240}
                            classNames={{
                                viewport: "pt-2.5",
                            }}
                        >
                            <>
                                {fontOptions}
                                {filteredFonts.slice(0, limit).length === 0 && (
                                    <div className="p-4 pt-2 text-sm opacity-70">
                                        No fonts found...
                                    </div>
                                )}
                                {filteredFonts.length > limit && (
                                    <div
                                        onClick={loadMoreFonts}
                                        className="cursor-pointer p-2 text-[0.85rem] text-primary-400 hover:bg-primary-50"
                                    >
                                        ...and{" "}
                                        {filteredFonts.length - limit} more.
                                        <span className="ml-2 font-bold text-blue-500 hover:underline">
                                            Load more
                                        </span>
                                    </div>
                                )}
                            </>
                        </ScrollArea.Autosize>
                    </ComboboxOptions>
                    <div className="border-t bg-white p-1">
                        <a href="https://fonts.google.com/" target="_blank" rel="noopener noreferrer">
                            <Button
                                variant="subtle"
                                color="blue"
                                size="sm"
                                className="flex items-center gap-1"
                            >
                                Browse on Google Fonts
                                <IconExternalLink size={15} className="ml-1" />
                            </Button>
                        </a>
                    </div>
                </ComboboxDropdown>
            </Combobox>

            <div className="pt-10 flex justify-center" style={{ fontFamily: selectedFont || 'inherit' }}>
                <p style={{ fontSize: "18px" }}>This is an example sentence with the selected font!</p>
            </div>
        </div>
    );
};

export default FontPicker;