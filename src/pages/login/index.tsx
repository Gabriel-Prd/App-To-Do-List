import React, { useState } from "react";

import {Text, View, Image, TextInput, TouchableOpacity, Alert, ActivityIndicatorBase, ActivityIndicator} from 'react-native'
import {style} from './styles' 
import Logo from '../../assets/logo.png'
import {MaterialIcons, Octicons} from '@expo/vector-icons'
import { themas } from "../../global/themes";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import {useNavigation, NavigationProp} from '@react-navigation/native'

export function Login(){

    const navigation = useNavigation<NavigationProp<any>>()

    const [email, setEmail] = useState('email@gmail.com')
    const [password, setPassword] = useState('senha123')
    const [showPassword, setShowPassword] = useState(true)
    const [loading, setLoading] = useState(false)

    async function getLogin(){
        try {
            setLoading(true)
            if(!email || !password){
                return Alert.alert('Atenção', 'Informe os campos obrigatórios.')
                
            }

            if(email === 'email@gmail.com' && password === 'senha123'){
                navigation.reset({routes:[{name:"BottomRoutes"}]})
            }else{
                Alert.alert('Atenção','Email ou senha invalidos')
            }

            
            
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    return(
        <View style={style.container}>
            <View style={style.boxTop}>
                <Image 
                    source={Logo} 
                    style={style.logo} 
                    resizeMode="contain"
                />
                <Text style={style.text}>Bem vindo de volta!</Text>
            </View>
            <View style={style.boxMid}>
                <Input
                    onChangeText={(e) => setEmail(e)} //Primera forma de fazer
                    value={email}
                    title="ENDEREÇO DE E-MAIL"
                    iconRightName="email"
                    IconRight={MaterialIcons}
                />
                <Input
                    value={password}
                    onChangeText={setPassword} //Segunda forma de fazer
                    title="SENHA"
                    iconRightName={showPassword?"eye":"eye-closed"}
                    IconRight={Octicons}
                    secureTextEntry={showPassword}
                    onIconRightPress={() => setShowPassword(!showPassword)}
                />
            </View>
            <View style={style.boxBottom}>
                <Button
                    text="Entrar"
                    loading={loading}
                    onPress={() => getLogin()}
                />
            </View>
            <Text style={style.textBottom}>Não tem conta? <Text style={{color:themas.colors.primary}}>Crie agora!</Text></Text>
        </View>
    )
}