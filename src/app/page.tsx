import FontPicker from "@/app/components/FontPicker";
import React from "react";
import { Title } from "@mantine/core";

export default function Home() {
    const font = "";

    return (
        <div className="w-full max-w-3xl mx-auto align-center pt-10 justify-center">
            <FontPicker
                label={<Title>Font Picker</Title>}
                currentFontName={font}
            />
        </div>
    );
}