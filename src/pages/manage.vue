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
                        query:'5'
                    },{
                        pageName:'ManageIndex',
                        query:"4"
                    },{
                        pageName:'ManageIcon',
                        query:"3"
                    }
                ]
            }
        }
}
</script>

