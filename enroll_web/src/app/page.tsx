'use client';

import React from "react";
import { NextPage } from "next";
import CSVFileUpload from "./components/FileUpload/FileUpload";
import { useRouter } from "next/navigation";

const HomePage: NextPage = () => {
    const router = useRouter();
    const [ready, setReady] = React.useState(false);

    return (
        <div>
            <CSVFileUpload setReady={setReady} />
            {ready && (
                <div className="text-center mb-6">
                    <button
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                        type="button"
                        onClick={() => {
                            router.push("/pages/settings");
                        }}
                    >
                        Start Algorithm
                    </button>
                </div>
            )}
        </div>
    );
}

export default HomePage;
