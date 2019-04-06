<template>
    <div>
        <div>
            <router-link to="index">
                <yd-button type="primary">Index</yd-button>
            </router-link>
            <router-link to="index">
                <yd-button type="primary">Icon</yd-button>
            </router-link>
        </div>
        <childpageslider :groupname="'manage'" :dataSlider="dataSlider"></childpageslider>
    </div>
</template>
<script>
export default {
        data(){
            return {
                dataSlider:[
                    {
                        pageName:'ManageIndex',
                        param:'5'
                    },{
                        pageName:'ManageIndex',
                        param:"4"
                    },{
                        pageName:'ManageIcon',
                        param:"3"
                    }
                ]
            }
        }
}
</script>

