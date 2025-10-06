"use client";

import { getRandomDog } from "@/features/random-dog";
import { RandomDogRes } from "@/features/random-dog/model/random-dog";
import { ja } from "@/shared/lang/ja";
import { createOption, Option, OPTION_SOME } from "@/utils/option";
import { RESULT_OK } from "@/utils/result";
import Image from "next/image";
import { useState } from "react";

function RandomStart() {
    const [dog, setDog] = useState<Option<RandomDogRes>>(createOption.none());
    const [error, setError] = useState<boolean>(false);

    const handleClick = async () => {
        if (error) {
            setError(false);
        }

        if (dog.kind === OPTION_SOME) {
            setDog(createOption.none());
        }

        const res = await getRandomDog();

        if (res.kind === RESULT_OK) {
            setDog(createOption.some(res.value));
        } else {
            setError(true);
        }
    };

    return (
        <section>
            <div>
                {error ? (
                    <p>{ja.app.serverActionSample.error}</p>
                ) : dog.kind === OPTION_SOME ? (
                    <Image
                        src={dog.value.message}
                        width={150}
                        height={100}
                        alt=""
                    />
                ) : null}
            </div>
            <button onClick={handleClick}>
                {ja.app.serverActionSample.button}
            </button>
        </section>
    );
}

export default RandomStart;
