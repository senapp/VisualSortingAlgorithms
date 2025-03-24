import * as React from 'react';
import css from './RenderView.module.css';
import { useState } from 'react';
import { Button } from './common/Button';

type Props = {
}

export const RenderView: React.FC<Props> = ({  }) => {
    const [visualArray, setVisualArray] = useState([3, 1, 8, 0, 4, 7, 2, 6, 5, 9]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [targetIndex, setTargetIndex] = useState(-1);
    
    const [storedValueVisual, setStoredValueVisual] = useState<undefined|number>(undefined);

    const [switchAnimation, setSwitchAnimation] = useState(false);
    const [setAnimation, setSetAnimation] = useState(false);
    const [storeAnimation, setStoreAnimation] = useState(false);
    const [setFromStoredAnimation, setSetFromStoredAnimation] = useState(false);
    const [highlightStoredValue, setHighlightStoredValue] = useState(false);


    const animationSpeed = 0.2;
    const highlightingSpeed = 0.1;
    const spacing = 50;

    const bubbleSortVisual = async () => {
        let swapped = true;
        let newArray = [...visualArray];
        while (swapped) {
            swapped = false;
            for (let i = 0; i < newArray.length - 1; i++) {
                if (await checkValue(newArray, i) > await checkValue(newArray, i + 1)) {
                    newArray = await switchElements(newArray, i, i + 1);
                    setVisualArray(newArray);
                    resetPointers();
                    swapped = true;
                }
            }
        }

        setVisualArray(newArray);
        resetPointers();
        sortingFinished();
    };

    const selectionSortVisual = async () => {
        let newArray = [...visualArray];
        for (let i = 0; i < newArray.length; i++) {
            let minIndex = i;
            for (let j = i + 1; j < newArray.length; j++) {
                if (await checkValue(newArray, j) < await checkValue(newArray, minIndex)) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                newArray = await switchElements(newArray, i, minIndex);
                setVisualArray(newArray);
                resetPointers();
            }
        }

        resetPointers();
        setVisualArray(newArray);
        sortingFinished();
    };

    const insertionSortVisual = async () => {
        let newArray = [...visualArray];
        for (let i = 1; i < newArray.length; i++) {
            let key = await storeElement(newArray, i);
            let j = i - 1;
            while (j >= 0 && (await checkValue(newArray, j)) > await checkStoredValue(key)) {
                newArray = await setValue(newArray, j + 1, j);
                j--;
                setVisualArray(newArray);
                resetPointers();
            }
            newArray[j + 1] = await setFromStored(j + 1, key);
            setVisualArray(newArray);
            resetPointers();
        }

        setVisualArray(newArray);
        sortingFinished();
    };

    const sortingFinished = () => {
        setStoredValueVisual(undefined);
        setSetAnimation(false);
        setSwitchAnimation(false);
        setStoreAnimation(false);
        setSetFromStoredAnimation(false);
        setHighlightStoredValue(false);
        resetPointers();
        alert('Sorting finished!');
    }

    const resetPointers = () => {
        setCurrentIndex(-1);
        setTargetIndex(-1);
    }

    const storeElement = async (array: number[], index: number): Promise<number> => {
        setCurrentIndex(index);
        setStoreAnimation(true);
        await new Promise(resolve => setTimeout(resolve, animationSpeed * 1000 + animationSpeed * 500));
        setStoreAnimation(false);
        setStoredValueVisual(array[index]);
        return array[index];
    }

    const setFromStored = async (index: number, storedValue: number): Promise<number> => {
        setTargetIndex(index);
        setSetFromStoredAnimation(true);
        await new Promise(resolve => setTimeout(resolve, animationSpeed * 1000 + animationSpeed * 500));
        setSetFromStoredAnimation(false);
        return storedValue;
    }

    const checkValue = async (array: number[], index: number): Promise<number> => {
        setCurrentIndex(index);
        await new Promise(resolve => setTimeout(resolve, highlightingSpeed * 1000));
        return array[index];
    }

    const checkStoredValue = async (storedValue: number): Promise<number> => {
        setCurrentIndex(-1);
        setHighlightStoredValue(true);
        await new Promise(resolve => setTimeout(resolve, highlightingSpeed * 1000));
        setHighlightStoredValue(false);
        return storedValue;
    }
    
    const setValue = async (array: number[], destinationIndex: number, sourceIndex: number, sourceOffsetVisual: number = 0): Promise<number[]> => {
        setCurrentIndex(sourceIndex + sourceOffsetVisual);
        setTargetIndex(destinationIndex);
        setSetAnimation(true);
        await new Promise(resolve => setTimeout(resolve, animationSpeed * 1000 + animationSpeed * 750));
        setSetAnimation(false);
        let newArray = [...array];
        newArray[destinationIndex] = newArray[sourceIndex];
        return newArray;
    }

    const switchElements = async (array: number[], index1: number, index2: number): Promise<number[]> => {
        setCurrentIndex(index1);
        setTargetIndex(index2);
        setSwitchAnimation(true);
        await new Promise(resolve => setTimeout(resolve, animationSpeed * 1000 + animationSpeed * 750));
        setSwitchAnimation(false);
        let newArray = [...array];
        [newArray[index1], newArray[index2]] = [newArray[index2], newArray[index1]];
        return newArray;
    }

    return (<>
        <Button onClick={() => bubbleSortVisual()} label='Bubble Sort'></Button>
        <Button onClick={() => selectionSortVisual()} label='Selection Sort'></Button>
        <Button onClick={() => insertionSortVisual()} label='Insertion Sort'></Button>

        <div className={css.container}>
            <>
            {
                storedValueVisual !== undefined && <div style={{
                    "backgroundColor": highlightStoredValue ? "green" : "white"
                }} className={`${css.cell} ${css.storedCell}`.trimEnd()}>{storedValueVisual}</div>
            }
          {
              visualArray.map((element, index) => {
                  let isCurrent = index === currentIndex;
                let isTarget = index === targetIndex;
                if (isCurrent && switchAnimation) {
                    return <div style={{
                        "--target": `${(targetIndex - currentIndex) * spacing}px`,
                        "--animationSpeed": `${animationSpeed}s`
                    } as React.CSSProperties} className={css.cell + " " + css.currentCell + " " + css.animationPrimary}>{element}</div>;
                } else if (index === targetIndex && switchAnimation) {
                    return <div style={{
                        "--current": `${(targetIndex - currentIndex) * -spacing}px`,
                        "--animationSpeed": `${animationSpeed}s`
                    } as React.CSSProperties} className={css.cell + " " + css.targetCell + " " + css.animationSecondary}>{element}</div>;
                }
                
                if (isCurrent && setAnimation) {
                    const offset = visualArray.length / 2 * -spacing + 0.5 * spacing;
                    return <><div style={{
                        "--target": `${offset + spacing * targetIndex}px`,
                        "--start": `${offset + spacing * currentIndex}px`,
                        "--animationSpeed": `${animationSpeed}s`,
                        "position": "absolute"
                    } as React.CSSProperties} className={css.cell + " " + css.currentCell + " " + css.animationPrimary}>{element}</div>
                    <div className={`${css.cell}`.trimEnd()}>{element}</div>
                    </>;
                }

                if (isTarget && setAnimation) {
                    return <div style={{
                        "--animationSpeed": `${animationSpeed}s`
                    } as React.CSSProperties} className={`${css.cell} ${css.targetCell} ${css.animationDiscard}`.trimEnd()}>{element}</div>;
                }

                if (isCurrent && storeAnimation) {
                    const offset = visualArray.length / 2 * -spacing + 0.5 * spacing;
                    return <><div style={{
                        "--start": `${offset + spacing * currentIndex}px`,
                        "--animationSpeed": `${animationSpeed}s`,
                        "backgroundColor": "green",
                        "position": "absolute"
                    } as React.CSSProperties} className={css.cell + " " + css.animationStore}>{element}</div>
                    <div className={`${css.cell}`.trimEnd()}>{element}</div>
                    </>;
                }

                if (isTarget && setFromStoredAnimation) {
                    const offset = visualArray.length / 2 * -spacing + 0.5 * spacing;
                    return <><div style={{
                        "--target": `${offset + spacing * targetIndex}px`,
                        "--animationSpeed": `${animationSpeed}s`,
                        "backgroundColor": "green",
                        "position": "absolute"
                    } as React.CSSProperties} className={css.cell + " " + " " + css.animationSetFromStored}>{storedValueVisual}</div>
                    <div className={`${css.cell} ${isTarget && css.targetCell}`.trimEnd()}>{element}</div>
                    </>;
                }

                return <div className={`${css.cell} ${isCurrent && css.currentCell} ${isTarget && css.targetCell}`.trimEnd()}>{element}</div>;
            })
        }
        </>
        </div>
    </>
    );
};