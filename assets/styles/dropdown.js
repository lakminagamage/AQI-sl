import { StyleSheet } from 'react-native';
import { colors } from '../colors/colors';

const dropdownStyles = StyleSheet.create({

    dropdown: {
        height: 40,
        marginTop: 10,
        borderColor: colors.grey,
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
});

export { dropdownStyles };