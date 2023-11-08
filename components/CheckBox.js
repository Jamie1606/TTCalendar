import React from 'react';
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function CheckBox(props) {
    const { updateStatus, initialState } = props;
    const [checkState, setCheckState] = React.useState(initialState);

    React.useEffect(() => {
        setCheckState(initialState);
    }, [initialState]);

    return (
        <BouncyCheckbox isChecked={checkState} disableBuiltInState {...props}
            onPress={() => {
                setCheckState(!checkState);
                updateStatus();
            }}
        />
    );
};