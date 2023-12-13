import {useStoreContext} from "../hooks";
import {isDot, isEqual, isNumber} from "../util";
import {DOT} from "../const";

const opPadArray = ["", "C", "+", "-", "*", "/" ];
const NUM_PAD = [
    "7", "8", "9",
    "4", "5", "6",
    "1", "2", "3",
    ".", "0", "="
];
const actionList = {
    "undo":"undo", "redo":"redo"
};
const historyList = {
    "clear":"clear History",
    "load":"load History",
    "save":"save History"
};
const historyPadArray = [
    "clear History",
    "load History",
    "save History"
];

function ButtonPad({item, onClick}) {
    function handleClick() {
        onClick(item);
    };

    return (
        <button className="item" value={item} onClick={handleClick}>
            {item}
        </button>
    )
}

function NumPadPart() {
    const { input, setInput, calc } = useStoreContext();

    function handleClick(item) {
        if (isDot(item)) {
            // todo fixme
            setInput(`${+input}${DOT}`);

            return;
        }

        if (isNumber(item)) {
            if (input === null) {
                setInput(item);

                return;
            }

            setInput(`${input}${item}`);

            return;
        }

        if (isEqual(item)) {
            calc();

            return;
        }
    }


    return (
        <div className="num-pad">
            {NUM_PAD.map((item) => <ButtonPad key={item} item={item} onClick={handleClick} />)}
        </div>
    )
}

function OpPadPart() {
    // const calculator = useCalculatorContext();
    const {input, result, setInput, setResult} = useStoreContext();

    function handleOpPadEvent(e) {
        const op = e.target.value;
        setInput(null);

        if (op === "C") {
            setResult(null)

            return;
        }

        if (input === '') {
            calculator.curOperator = op;
            return;
        }
        setResult(calculator.calculate(input, op));
        history.addHistory(result);
    };

    const buttonArray = opPadArray.map((item) => {
        return <ButtonPad key={item}
                          itemValue={item}
                          handleEvent={handleOpPadEvent} />;
    });

    return (
        <div className="op-pad">
            {buttonArray}
        </div>
    )
}

function HistoryPadPart() {
    function handleHistoryPadEvent(e) {
        const key = e.target.value;
        console.log(key);
        switch (key) {
            case historyList["save"]:
                history.handleSaveHistoryButton();
                break;
            case historyList["load"]:
                history.handleLoadHistoryButton();
                break;
            case historyList["clear"]:
                history.handleClearHistoryButton();
                break;
            default:
                console.log("Invalid key");
                break;
        }
    }

    return (
        <div className="history-pad">
            {historyPadArray.map((item) => {
                return <ButtonPad key={item}
                                  itemValue={item}
                                  handleEvent={handleHistoryPadEvent} />;
            })}
        </div>
    );
}

const actionHistoryArray = ["undo", "redo", ""];

function ActionPadPart() {
    const {result, setInput, setResult} = useStoreContext();
    // const calculator = useCalculatorContext();

    function handleActionButton(e) {
        switch (e.target.value) {
            case actionList.redo:
                processRedo();
                return;
            case actionList.undo:
                processUndo();
                return;
            default:
                return;
        }
    }

    function processUndo() {
        setResult(history.undo());
        calculator.setValue(result);
        setInput(null);
    }

    function processRedo() {
        setResult(history.redo());
        setInput(null);
    }

    return (
        <div className="action-pad">
            {actionHistoryArray.map((item) => {
                return <ButtonPad key={item}
                                  itemValue={item}
                                  handleEvent={handleActionButton} />;
            })}
        </div>
    );
}

export function PadPart() {
    return (
        <div className="pad">
            <div>
                {/* todo <HistoryPadPart /> */}
                {/* todo <ActionPadPart /> */}
                <NumPadPart />
            </div>
            <div>
                <OpPadPart />
            </div>
        </div>
    )
}
