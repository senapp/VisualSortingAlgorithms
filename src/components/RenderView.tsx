import * as React from 'react';
import css from './RenderView.module.css';
import { useState } from 'react';
import { Button } from './common/Button';

type Props = {
}

export const RenderView: React.FC<Props> = ({  }) => {
    const [visualArray, setVisualArray] = useState([3, 1, 8, 5, 9, 6]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [targetIndex, setTargetIndex] = useState(-1);
    
    const [storedValueVisual, setStoredValueVisual] = useState<undefined|number>(undefined);

    const [switchAnimation, setSwitchAnimation] = useState(false);
    const [setAnimation, setSetAnimation] = useState(false);
    const [storeAnimation, setStoreAnimation] = useState(false);
    const [setFromStoredAnimation, setSetFromStoredAnimation] = useState(false);
    const [highlightStoredValue, setHighlightStoredValue] = useState(false);

    const [isSorting, setIsSorting] = useState(false);
    const [sliderValue, setSliderValue] = useState(50)


    const animationSpeed = 0.05 / (sliderValue / 100);
    const highlightingSpeed = animationSpeed / 2;
    const spacing = 50;

    // Logarithmic

    const partition = async (array: number[], left: number, right: number): Promise<[number[], number]> => {
        let newArray = [...array];
        const pivotValue = await storeElement(newArray, right);
        let pivotIndex = left;
        for (let i = left; i < right; i++) {
            if (await checkValue(newArray, i) < await checkStoredValue(pivotValue)) {
                if (i !== pivotIndex) {
                    newArray = await switchElements(newArray, i, pivotIndex);
                    setVisualArray(newArray);
                }
                resetPointers();
                pivotIndex++;
            }
        }
        if (right !== pivotIndex) {
            newArray = await switchElements(newArray, pivotIndex, right);
            setVisualArray(newArray);
        }
        resetPointers();
        return [newArray, pivotIndex];
    };

    const quickSortFunction = async (array: number[], left = 0, right = array.length - 1) => {
        let newArray = [...array];
        let newPivotIndex = 0;
        if (left < right) {
            [newArray, newPivotIndex] = await partition(newArray, left, right);
            newArray = await quickSortFunction(newArray, left, newPivotIndex - 1);
            newArray = await quickSortFunction(newArray, newPivotIndex + 1, right);
        }
        return newArray;
    };

    const quickSortVisual = async () => {
        setIsSorting(true);
        quickSortFunction([...visualArray]).then(() => {
            sortingFinished();
        });
    }

    //Quadratic

    const bubbleSortVisual = async () => {
        setIsSorting(true);
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
        setIsSorting(true);
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
        setIsSorting(true);
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

    // Bad
    const bogoSortVisual = async () => {
        setIsSorting(true);
        let newArray = [...visualArray];
        for (let i = 0; i < newArray.length; i++) {
            if (i < newArray.length - 1 && (await checkValue(newArray, i) <= await checkValue(newArray, i + 1))) {
                resetPointers();
            } else if (i == newArray.length - 1) {
                continue;
            } else {
                i = -1;
                shuffle(newArray);
                setVisualArray(newArray);
            }
        }

        setVisualArray(newArray);
        sortingFinished();
    }

    const shuffle = (array: number[]): void => {
        let currentIndex = array.length;
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
          // Pick a remaining element...
          let randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      }

    const randomizeNumbers = () => {
        const newArray = Array.from({ length: Math.max(4, Math.floor(Math.random() * 8)) }, () => Math.floor(Math.random() * 100));
        setVisualArray(newArray);
    };

    const sortingFinished = () => {
        setStoredValueVisual(undefined);
        setSetAnimation(false);
        setSwitchAnimation(false);
        setStoreAnimation(false);
        setSetFromStoredAnimation(false);
        setHighlightStoredValue(false);
        resetPointers();
        setIsSorting(false);
        setTimeout(() => {
            alert('Sorting finished!');
        }, 500);
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

    const checkValue = async (array: number[], index: number, visualNumber: number = index): Promise<number> => {
        setCurrentIndex(visualNumber);
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

    const maxValue = Math.max(...visualArray)
    const color = "#d8adff";

    return (<>
        <div className={css.buttonContainer}>
            <div className={css.sortTitle}>
                Logarithmic Sorting:
                <div className={css.sortContainer}>
                    <Button disabled={isSorting} onClick={() => quickSortVisual()} label='Quick Sort'></Button>
                </div>
            </div>
            <div className={css.sortTitle}>
                Quadratic Sorting:
                <div className={css.sortContainer}>
                    <Button disabled={isSorting} onClick={() => bubbleSortVisual()} label='Bubble Sort'></Button>
                    <Button disabled={isSorting} onClick={() => selectionSortVisual()} label='Selection Sort'></Button>
                    <Button disabled={isSorting} onClick={() => insertionSortVisual()} label='Insertion Sort'></Button>
                </div>
            </div>
            <div className={css.sortTitle}>
                "Terrible" Sorting:
                <div className={css.sortContainer}>
                    <Button disabled={isSorting} onClick={() => bogoSortVisual()} label='Bogo Sort'></Button>
                </div>
            </div>
            <div className={css.sortTitle}>
                Randomize Numbers:
                <div className={css.sortContainer}>
                    <Button disabled={isSorting} onClick={() => randomizeNumbers()} label='Randomize Numbers'></Button>
                </div>
            </div>
            <div className={css.sortTitle}>
                Animation Speed:
                <div className={css.sortContainer}>
                    <input disabled={isSorting} type="range" min="1" max="100" value={sliderValue} onChange={(e) => setSliderValue(parseInt(e.target.value))} className={css.slider} id="myRange"></input>
                </div>
            </div>
        </div>
        <div className={css.barContainer}>
                 {visualArray.map((element, index) => {
                   let height = 75;
                   return <div style={{ "height": `${Math.max(1, height * (element/maxValue))}px`}} className={`${css.bar}`.trimEnd()}></div>;
               })
           }
        </div>
        <div className={css.container}>
            <>
            {
                storedValueVisual !== undefined && <div style={{
                    "backgroundColor": highlightStoredValue ? color : "white"
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
                    } as React.CSSProperties} className={css.cell + " " + css.currentCell + " " + css.animationSet}>{element}</div>
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
                        "backgroundColor": color,
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
                        "backgroundColor": color,
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