import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View,
    ScrollView,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';

import Config from './src/Config';
import Header from './src/components/Header';
import Footer from './src/components/Footer';


export default class App extends React.Component {

    
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            note: ''
        }

    }

    /* Load notes from async storage */
    async componentDidMount() {

        const notes = await AsyncStorage.getItem('notes');
        if (notes && notes.length > 0) {
            this.setState({
                notes: JSON.parse(notes)
            })
        }

    }

    /* Update the async storage */
    updateAsyncStorage(notes) {

        return new Promise( async(resolve, reject) => {

            try {

                await AsyncStorage.removeItem('notes');
                await AsyncStorage.setItem('notes', JSON.stringify(notes));
                return resolve(true);

            } catch(e) {
                return reject(e);
            }

        });

    }

    /* Create copy of the notes */
    cloneNotes() {
        return [...this.state.notes];
    }

    /* Adding new Note */
    async addNote() {

        if (this.state.note.length <= 0)
            return;

        try {

            const notes = this.cloneNotes();
            notes.push(this.state.note);

            await this.updateAsyncStorage(notes);

            this.setState({
                notes: notes,
                note: ''
            });

        }

        catch(e) {

            // notes could not be updated
            alert(e);

        }

    }

    /* Remove the note */
    async removeNote(i) {

        try {

            const notes = this.cloneNotes();
            notes.splice(i, 1);

            await this.updateAsyncStorage(notes);
            this.setState({ notes: notes });

        }

        catch(e) {

            // Note could not be deleted
            alert(e);

        }

    }

    /* Render */
    renderNotes() {

        return this.state.notes.map((note, i) => {
            return (
                <TouchableOpacity 
                    key={i} style={styles.note} 
                    onPress={ () => this.removeNote(i) }
                >
                    <Text style={styles.noteText}>{note}</Text>
                </TouchableOpacity>
            );
        });

    }

    render() {

        return (
            <View style={styles.container}>

                <Header title={Config.title} />

                <ScrollView style={styles.scrollView}>
                    {this.renderNotes()}
                </ScrollView>

                <Footer
                    onChangeText={ (note) => this.setState({note})  }
                    inputValue={this.state.note}
                    onNoteAdd={ () => this.addNote() }
                />

            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },
    scrollView: {
        maxHeight: '82%',
        marginBottom: 100,
        backgroundColor: '#424242'
    },
    note: {
        margin: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        backgroundColor: '#000',
        borderColor: '#000',
        borderRadius: 10,
    },
    noteText: {
        fontSize: 14,
        padding: 20,
        color: '#FFF'
    }
});
