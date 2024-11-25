import React, { useEffect, useState } from "react";
import { Modal, Platform, View } from 'react-native'
import {style} from './styles'
import DateTimePicker from '@react-native-community/datetimepicker'

const CustomDateTimePicker = ({type, onDataChange, show, setShow}:any) => {

    const [date, setDate] = useState(new Date())

    useEffect(()=>{

        if(onDataChange){
            onDataChange(date)
        }

    }, [date, onDataChange])

    const onChange = (event:any, selectedDate:any) => {
        const currentDate = selectedDate || date
        setDate(currentDate)
        setShow(false) //Oculta após a seleção
    }

    return(
        <Modal
            transparent={true}
            visible={show}
            onRequestClose={()=>setShow(false)}
        >
            <View style={style.modalOverlay}>
                <View style={[
                    style.container, 
                    Platform.OS === 'android'&& {backgroundColor:'tranparent'}
                    ]}>
                    <DateTimePicker
                        value={date}
                        mode={type}
                        display={Platform.OS === 'ios'? 'inline':'default'}
                        onChange={onChange}
                    />
                </View>
            </View>
        </Modal>
    )

}

export default CustomDateTimePicker