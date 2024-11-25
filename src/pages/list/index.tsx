import React, { useContext, useRef } from "react";
import {Text, TouchableOpacity, View} from 'react-native'
import { style } from "./styles";
import { Input } from "../../components/Input";
import {AntDesign, MaterialIcons} from '@expo/vector-icons'
import { Directions, FlatList } from "react-native-gesture-handler";
import { Ball } from "../../components/Ball";
import { Flag } from "../../components/Flag";
import { themas } from "../../global/themes";
import { AuthContextList } from "../../context/authContext_list";
import { formatDatetoBr } from "../../global/fuctions";
import { Swipeable } from "react-native-gesture-handler";


export function List(){
    
    const {taskList, handleDelete, handleEdit, filter} = useContext<AuthContextType>(AuthContextList)
    const swipeableRefs = useRef([])

    const renderRightActions = () => {
        return(
            <View style={style.button}>
                <AntDesign
                    name='delete'
                    size={20}
                    color={'#FFF'}
                />
        </View>
        )
    }

    const renderLeftActions= () => {
        return(
            <View style={[style.button, {backgroundColor:themas.colors.blueLigth}]}>
                <AntDesign
                    name='edit'
                    size={20}
                    color={'#FFF'}
                />
        </View>
        )
    }

    const handleSwipeOpen = (directions: 'right'|'left', item:any, index:any) => {
        if(directions == 'right'){
            handleDelete(item)
        }else{
            handleEdit(item)
        }
        swipeableRefs.current[index]?.close()
    }

    const _renderCard = (item:PropCard, index:any)=>{
        const color = item.flag == 'opcional'? themas.colors.blueLigth:themas.colors.red
        return(

            <Swipeable
                ref={(ref) => swipeableRefs.current[index] = ref}
                key={index}
                renderRightActions={renderRightActions}
                renderLeftActions={renderLeftActions}
                onSwipeableOpen={(directions)=>handleSwipeOpen(directions, item, index)}
            >
                <View style={style.card}>
                    <View style={style.rowCard}>

                        <View style={style.rowCardLeft}>
                        <Ball color={color}/>
                        <View>
                            <Text style={style.titleCard}>{item.title}</Text>
                            <Text style={style.descriptionCard}>{item.description}</Text>
                            <Text style={style.descriptionCard}> até {formatDatetoBr(item.timeLimit)}</Text>
                        </View>

                        </View>

                        <Flag 
                            caption={item.flag} 
                            color={color}
                        />
                    </View>
                </View>
            </Swipeable>
        )
    }
    
    return(
        <View style={style.container}>
            <View style={style.header}>
                <Text style={style.greeting}>Olá, <Text style={{fontWeight:'bold'}}>Gabriel Prado</Text></Text>
                <View style={style.boxInput}>
                    <Input
                        IconLeft={MaterialIcons}
                        iconLeftName="search"
                        onChangeText={(t)=> filter(t)}
                    />
                </View>
            </View>
            <View style={style.boxList}>
                <FlatList 
                    data={taskList} 
                    style={{marginTop:40, paddingHorizontal:30}}
                    keyExtractor={(item, index)=>item.item.toString()}    
                    renderItem={({item, index}) => {return (_renderCard(item, index))}}  
                />
            </View>
        </View>
    )
}
