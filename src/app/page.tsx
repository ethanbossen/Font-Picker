import FontPicker from "@/app/components/FontPicker";
import React from "react";
import { Title } from "@mantine/core";

export default function Home() {
    const font = "";

    return (
        <div>
            <FontPicker
                label={<Title>Font Picker</Title>}
                currentFontName={font}
            />
        </div>
    );
}