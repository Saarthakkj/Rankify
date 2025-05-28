import { Montserrat, Instrument_Serif } from "next/font/google";

export const font = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
});

export const serifFont = Instrument_Serif({
    subsets: ["latin"],
    variable: "--font-instrument-serif",
    weight: ["400"],
})

