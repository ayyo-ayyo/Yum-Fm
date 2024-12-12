import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const uri = useLocalSearchParams().uri as string;
    const imageList = useLocalSearchParams().imageList as string[];
    
    const handleDelete = () => {
        if (confirmDelete) {
            return (
                <View >
                    <Text >Confirm delete?</Text>
                    <TouchableOpacity  onPress={() => imageList.filter((image: any) => image !== uri)}>
                        <Text >Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() => setConfirmDelete(false)}>
                        <Text >No</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }
    console.log(uri);
    return (
        <View style={styles.container}>
            <Image source={{uri}} style={styles.image} />
            <View style={styles.buttonContainer}>
                {/* <TouchableOpacity style={styles.button} onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={48} color="red" />
                </TouchableOpacity> */}
                {confirmDelete && (
                    <Text style={styles.confirmDelete}>Deleted!</Text>
                )}
            </View>
        </View>
    )
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: 10,
    },
    button: {
        padding: 10,
    },
    confirmDelete: {
        color: 'red',
        fontSize: 20,
        padding: 10,
    },
})