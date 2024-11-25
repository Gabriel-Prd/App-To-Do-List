import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Text, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, Platform} from "react-native";
import { Modalize } from "react-native-modalize";
import {MaterialIcons, AntDesign} from '@expo/vector-icons'
import { Input } from "../components/Input";
import { themas } from "../global/themes";
import { Flag } from "../components/Flag";
import CustomDateTimePicker from "../components/CustomDateTimePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContextList:any = createContext({})

const flags = [
    {caption: 'urgente', color:themas.colors.red},
    {caption: 'opcional', color:themas.colors.blueLigth}
]

export const AuthProviderList = (props:any):any =>{

    const modalizeRef = useRef<Modalize>(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [selectedFlag, setSelectedFlag] = useState('urgente')
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedTime, setSelectedTime] = useState(new Date())
    const [showDataPicker, setShowDataPicker] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)
    const [item, setItem] = useState(0)
    const [taskList, setTaskList] = useState<Array<PropCard>>([])
    const [taskListBackup, setTaskListBackup] = useState<Array<PropCard>>([])


    const onOpen = () =>{
        modalizeRef?.current?.open()
    }

    const onCLose = () =>{
        modalizeRef?.current?.close()
    }

    useEffect(() => {
        get_taskList()
    },[])

    const _renderFlags = () => {
            return flags.map((item, index) =>(
                <TouchableOpacity key={index}
                    onPress={() => {
                        setSelectedFlag(item.caption)
                    }}
                >
                    <Flag 
                        caption={item.caption}
                        color={item.color}
                        selected={item.caption == selectedFlag}
                    />

                </TouchableOpacity>
            ))
    }

    const handleDateChange = (date: any) =>{
        setSelectedDate(date)
    }

    const handleTimeChange = (date: any) => {
        setSelectedTime(date)
    }

    const handleSave = async() => {
        
        if(!title || !description || !selectedFlag){
            return Alert.alert("Atenção!", "Preencha os campos corretamente")
        }
        try {
            const newItem = {
                item:item !== 0?item:Date.now(),
                title,
                description,
                flag:selectedFlag,
                timeLimit: new Date(
                    selectedDate.getFullYear(),         
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    selectedTime.getHours(),
                    selectedTime.getMinutes()
                ).toISOString(),
            }
            
            const storageData = await AsyncStorage.getItem('taskList')
            let taskList:Array<any> = storageData ? JSON.parse(storageData):[]

            const itemIndex = taskList.findIndex((task)=> task.item === newItem.item)

            if(itemIndex >= 0){
                taskList[itemIndex] = newItem
            }else{
                taskList.push(newItem)
            }
            
            
            await AsyncStorage.setItem('taskList', JSON.stringify(taskList))
 
            setTaskList(taskList)
            setTaskListBackup(taskList)

            
            setData()
            onCLose()

        } catch (error) {
            console.log("Erro ao salvar o item", error)
        }

    }

    const setData = () => {
        setTitle('')
        setDescription('')
        setSelectedFlag('urgente')
        setItem(0)
        setSelectedDate(new Date())
        setSelectedTime(new Date())

    }

    async function get_taskList() {
        try {
            const storageData = await AsyncStorage.getItem('taskList')
            const taskList = storageData ?  JSON.parse(storageData):[]
            setTaskList(taskList)
            setTaskListBackup(taskList)
        } catch (error) {
            console.log(error)
        }
    }   

    const handleDelete = async (itemToDelete:any) => {
        try {
            const storageData = await AsyncStorage.getItem('taskList')
            const taskList:Array<any> = storageData ? JSON.parse(storageData):[]

            const updatedTaskList = taskList.filter(item=>item.item !== itemToDelete.item)
            
            await AsyncStorage.setItem('taskList', JSON.stringify(updatedTaskList)) 
            setTaskList(updatedTaskList)
            setTaskListBackup(updatedTaskList)


        } catch (error) {
            console.log('Error ao excluir o item', error)
        }
    }

    const handleEdit = async (itemToEdit:PropCard) =>{
        try {

            setTitle(itemToEdit.title)
            setDescription(itemToEdit.description)
            setItem(itemToEdit.item)
            setSelectedFlag(itemToEdit.flag)

            const timeLimit = new Date(itemToEdit.timeLimit)
            setSelectedDate(timeLimit)
            setSelectedTime(timeLimit)

            onOpen()
            
        } catch (error) {
            console.log('Error ao digitar')
        }
    } 

    const filter = (t:string) => {

        const array = taskListBackup
        const campos = ['title', 'description']
        
        if(t){
            const searchTerm = t.trim().toLowerCase()
            const FilteredArray = array.filter((item) => {
                for(let i=0; i<campos.length; i++){
                    if(item[campos[i]].trim().toLowerCase().includes(searchTerm)){
                        return true
                    }
                }
            })
            setTaskList(FilteredArray)
        }else{
            setTaskList(array)
        }

        
    }

    const _container = () =>{
        return (
            <KeyboardAvoidingView
                style={style.container}
                behavior={Platform.OS === 'ios'?'padding':'height'}
            >
                    <View style={style.header}>
                        <TouchableOpacity onPress={() => onCLose()}>
                            <MaterialIcons
                                name="close"
                                size={30}
                            />
                        </TouchableOpacity>
                        <Text style={style.title}>Criar tarefa</Text>
                        <TouchableOpacity onPress={() => handleSave()}>
                            <AntDesign
                                name="check"
                                size={30}

                            />
                        </TouchableOpacity>
                    </View>
                    <View style={style.content}>
                        <Input
                            title="Titulo:"
                            labelStyle={style.label}
                            value={title}
                            onChangeText={setTitle}
                        />
                        <Input 
                            title="Descrição:"
                            labelStyle={style.label}
                            height={100} 
                            multiline
                            numberOfLines={5}
                            value={description}
                            onChangeText={setDescription}
                            textAlignVertical="top"
                        />
                        <View style={{width:'40%'}}>
                            <View style={{flexDirection:'row', gap:10, width:'100%'}}>
                                <TouchableOpacity onPress={() => setShowDataPicker(true)} style={{width:200}}>
                                    <Input
                                        title="Data Limite"
                                        labelStyle={style.label}
                                        editable={false}
                                        value={selectedDate.toLocaleDateString()}
                                        onPress={() => setShowDataPicker(true)}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShowTimePicker(true)} style={{width:120}}>
                                    <Input
                                        title="Hora Limite"
                                        labelStyle={style.label}
                                        editable={false}
                                        value={selectedTime.toLocaleTimeString()}
                                        onPress={() => setShowTimePicker(true)}
                                    />
                                </TouchableOpacity>
                            </View>
                            <CustomDateTimePicker
                                onDataChange={handleDateChange}
                                setShow={setShowDataPicker}
                                show={showDataPicker}
                                type={'date'}
                            />
                            <CustomDateTimePicker
                                onDataChange={handleTimeChange}
                                setShow={setShowTimePicker}
                                show={showTimePicker}
                                type={'time'}
                            />
                        </View>
                        <View style={style.containerFlag}>
                            <Text style={style.label}>Flags:</Text>
                            <View style={style.Rowflag}>
                                {_renderFlags()}
                            </View>
                        </View>
                    </View>
            </KeyboardAvoidingView>
        )
    }

    return(
        <AuthContextList.Provider value={{onOpen, taskList, handleDelete, handleEdit, filter}}>
            {props.children}
            <Modalize
                ref={modalizeRef}
                childrenStyle={{height:Dimensions.get('window').height/1.7}}
                adjustToContentHeight={true}
            >
                {_container()}
            </Modalize>

        </AuthContextList.Provider>
    )
}

export const useAuth = () => useContext(AuthContextList)

const style = StyleSheet.create({

    container:{
        width:'100%'
    },
    header:{
        width:'100%',
        height:40,
        paddingHorizontal:40,
        flexDirection:'row',
        marginTop:20,
        justifyContent:"space-between",
        alignItems:'center'
    },
    title:{
        fontSize:20,
        fontWeight:'bold'
    },
    content:{
        width:'100%',
        paddingHorizontal:20
    },
    containerFlag:{
        width:'100%',
        padding:10
    },
    label:{
        fontWeight:'bold',
        color:'#000'
    },
    Rowflag:{
        flexDirection:'row',
        gap:10,
        marginTop:10,

    }


})