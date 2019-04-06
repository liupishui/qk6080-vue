<template>
    <div>
        ssss
        <input type="text" v-model="name" v-validate ="'required'" :class="{'input': true, 'is-danger': errors.has('name') }" name="name"/>
        <span v-show="errors.has('name')">{{ '姓名'+(errors.first('name')&&errors.first('name').substr(4)) }}</span>

        <input v-validate ="'required|email'" type="number" id="email" name="myEmail" :class="{'input': true, 'is-danger': errors.has('email') }">
        <span v-show="errors.has('myEmail')" class="help is-danger">{{ errors.first('myEmail')&&errors.first('myEmail').substr(7)}}</span>
        <input type="button" value="点击" @click="addname"/>
        <ul>
            <li v-for="(val,index) in list" :key="index">
                {{val}}
            </li>
        </ul>
    </div>
</template>
<script>
    import vue from "vue"
    import { watch } from 'fs';
    let that = this
    vue.component('dianying',{'template':'<div>ssssgggg</div>'})
    export default {
        data(){
            return {
                name:'',
                list:[
                    "Index",
                    "Dianying",
                    "Manage",
                    "Play"
                ]
            }
        },
        components:{
        },
        methods:{
            addname:()=>{
                console.log(this)
                //this.list.push(this.name);
            }
            
        },
        mounted(){
            console.log(this)
        },
        watch:{
            'name'(){
            }
        }
    }
</script>
<style scoped>
.is-danger{
    border-color:#f00;
}
</style>
