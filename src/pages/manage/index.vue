<template>
    <div>
        {{num}}
        <ButtonButton/>
    </div>
</template>
<script>
    export default {
        props:{
            childparam:{
                type:String,
                default:'1'
            }
        },
        data(){
            return {
                num:''
            }
        },
        created(){
            this.num = this.childparam;
        },
        mounted(){
            console.log('ManageIndex||',this.childparam)
        }
    }
</script>