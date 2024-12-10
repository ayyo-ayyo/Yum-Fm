import React, { useState } from 'react';
import { Text, Modal, View, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import Markdown from 'react-native-markdown-display';

type HelpModalProps = {
    showModal: (show: boolean) => void,
    text: String,
    visible: boolean
}

export default function HelpModal(props: HelpModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.visible}
        >
            <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, {height: "70%", alignItems: "flex-start"}]}>
                <ScrollView style={{marginBottom: 20, width: "100%"}}>
                <Markdown style={{heading1: {justifyContent: "center"}}}>
                    {props.text}
                </Markdown>
                </ScrollView>
                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => props.showModal(false)}
                >
                <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        },
        modalContent: {
        backgroundColor: '#fff',
        width: '80%',
        padding: 25,
        borderRadius: 15,
        alignItems: 'center',
        },
        modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#D74938',
        marginBottom: 15,
        },
        modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
        },
        modalButton: {
        backgroundColor: '#D74938',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        },
        modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        },
});