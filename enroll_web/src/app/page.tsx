import React from "react";
import { NextPage } from "next";
import CSVFileUpload from "./components/FileUpload/FileUpload";

const HomePage: NextPage = () => {
    return (
        <CSVFileUpload />
    );
}

export default HomePage;
