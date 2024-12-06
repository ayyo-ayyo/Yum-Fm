import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity} from 'react-native';

type HelpProps = {
    showModal: (show: boolean) => void
};

export default function HelpButton(props: HelpProps) {
    return (
        <TouchableOpacity
            style={styles.helpButton}
            onPress={() => props.showModal(true)}
        >
            <Text style={styles.helpButtonText}>?</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    helpButton: {
        backgroundColor: '#D74938',
        paddingHorizontal: 0, 
        paddingVertical: 0, 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: 50, height: 50, 
        borderRadius: 35,
        position: "absolute",
        bottom: 50,
        right: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
    },
    helpButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});