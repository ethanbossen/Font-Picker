"use client";

import React, { ReactNode, useCallback, useEffect, useState } from "react";
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

import { IconExternalLink, IconSearch, IconX } from "@tabler/icons-react";
import { WebfontFamily } from "google-fonts";
import { useFonts } from "@/app/hooks/useFonts";

const FONT_LIMIT = 10;

const getFontLink = (fontFamily: string): string => {
    return encodeURI(
        `https://fonts.googleapis.com/css2?family=${fontFamily}&display=swap`,
    );
};

const applyFontStyle = (fontFamily: string) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = getFontLink(fontFamily);
    document.head.appendChild(link);
};

export const FontPicker = function ({
                                        siteUUID,
                                        label,
                                        currentFontName,
                                        updateFont,
                                    }: {
    siteUUID: string;
    label: ReactNode;
    currentFontName?: string;
    updateFont: (font: WebfontFamily) => void;
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [loadedStylesMap, setLoadedStylesMap] = useState<{ [key: string]: boolean }>({});
    const [limit, setLimit] = useState(FONT_LIMIT);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const { fonts, loading, error } = useFonts(siteUUID); // Using the hook with the siteUUID

    const fontsList = (fonts || []).filter((f) => {
        const family = f.family;
        return !family?.includes("Icons") && !family?.includes("Symbols");
    });

    const loadFontStyles = useCallback(
        (fontFamily: string) => {
            if (loadedStylesMap[fontFamily]) {
                return;
            } else {
                loadedStylesMap[fontFamily] = true;
                setLoadedStylesMap(loadedStylesMap);
                applyFontStyle(fontFamily);
            }
        },
        [loadedStylesMap]
    );

    useEffect(() => {
        if (currentFontName) {
            loadFontStyles(currentFontName);
        }
    }, [currentFontName, loadFontStyles]);

    const filteredFonts = (fontsList || []).filter((font) => {
        if (!searchQuery?.trim()) {
            return true;
        }

        return (font.family || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
    });

    const filteredFontsWithLimit = filteredFonts.slice(0, limit);

    const loadMoreFonts = () => {
        setLimit((prevLimit) => prevLimit + FONT_LIMIT);
    };

    filteredFontsWithLimit.forEach((font) => {
        loadFontStyles(font.family);
    });

    const handleFontSelection = (font: WebfontFamily) => {
        updateFont(font);
        loadFontStyles(font.family);
    };

    function getFontOption(font: WebfontFamily) {
        return (
            <ComboboxOption
                key={font.family}
                value={font.family}
                onClick={() => {
                    handleFontSelection(font);
                    combobox.closeDropdown();
                }}
                style={{ fontFamily: font.family }}
            >
                {font.family}
            </ComboboxOption>
        );
    }

    const fontOptions = filteredFontsWithLimit.map((font) => getFontOption(font));

    if (loading) {
        return <div>Loading fonts...</div>;
    }

    if (error) {
        return <div>Error loading fonts: {error}</div>;
    }

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
                        label={label}
                        pointer
                        rightSection={<ComboboxChevron />}
                        onClick={() => combobox.toggleDropdown()}
                        rightSectionPointerEvents="none"
                        multiline
                    >
                        {currentFontName ? (
                            <div
                                className="text-[1rem]"
                                style={{ fontFamily: currentFontName }}
                            >
                                {currentFontName}
                            </div>
                        ) : (
                            <div></div>
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
                                {filteredFontsWithLimit.length === 0 && (
                                    <div className="p-4 pt-2 text-sm opacity-70">
                                        No fonts found...
                                    </div>
                                )}
                                {filteredFonts.length !== filteredFontsWithLimit.length && (
                                    <div
                                        onClick={loadMoreFonts}
                                        className="cursor-pointer p-2 text-[0.85rem] text-primary-400 hover:bg-primary-50"
                                    >
                                        ...and{" "}
                                        {filteredFonts.length - filteredFontsWithLimit.length} more.
                                        <span className="ml-2 font-bold text-blue-500 hover:underline">
                                            Load more
                                        </span>
                                    </div>
                                )}
                            </>
                        </ScrollArea.Autosize>
                    </ComboboxOptions>
                    <div className="border-t bg-white p-1">
                        <a href="https://fonts.google.com/" target="_blank">
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
        </div>
    );
};

export default FontPicker;