import { Button, Dimensions, StyleSheet } from "react-native";
import { themas } from "../../global/themes";

export const style = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    boxTop:{
        paddingTop:100,
        height:Dimensions.get('window').height/3,
        width:'100%',
        alignItems:'center',
        justifyContent:'center'
    }, 
    boxMid:{
        height:Dimensions.get('window').height/4,
        width:'100%',
        paddingHorizontal:37,
    },
    boxBottom:{
        height:Dimensions.get('window').height/3,
        width:'100%',
        alignItems:'center',
    },
    logo:{
        width:80,
        height:80,
    },
    text:{
        fontWeight:'bold',
        marginTop:40,
        fontSize:18
    },
    textBottom:{
        fontSize:16,
        color:themas.colors.gray
    }
})