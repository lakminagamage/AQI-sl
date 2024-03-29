import { StyleSheet } from 'react-native';
import { colors } from '../colors/colors';

const buttonStyles = StyleSheet.create({
    buttonPrimary: {
        flexDirection: 'row',
        marginTop: 25,
        backgroundColor: colors.darkBlue,
        width: 250,
        height: 40,
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },

    buttonSecondary: {
        flexDirection: 'row',
        marginTop: 25,
        backgroundColor: colors.white,
        width: 150,
        height: 40,
        borderWidth: 1,
        borderColor: colors.darkBlue,
        borderRadius: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },

    buttonSecondaryBlue: {
        backgroundColor: colors.darkBlue,
    },

    buttonIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },

    buttonText: {
        color: colors.white,
        fontSize: 17,
    },

    buttonTextSecondary: {
        color: colors.darkBlue,
        fontSize: 17,
    },

    buttonTextSecondaryWhite: {
        color: colors.white,
        fontSize: 17,
    },

    dashButton: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '90%',
        height: 40,
        marginTop: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#0A1931',
        justifyContent: 'center',
        alignItems: 'center',
    },

    dashButtonText: {
        color: "#0A1931",
        fontSize: 20,
        marginLeft: 10,
    },

    dashButtonIcon: {
        width: 20,
        height: 20,
        marginLeft: 'auto',
        marginRight: 10,
    },

    buttonLightBlue: {
        flexDirection: 'row',
        marginTop: 10,
        backgroundColor: colors.lightBlue,
        width: '100%',
        height: 50,
        borderRadius: 10,
        display: 'flex',
        paddingHorizontal: 20,
        alignItems: 'center',
    }
});

export { buttonStyles };