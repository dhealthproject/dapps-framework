import { Options } from "vue-class-component";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import { AbstractMetaView } from "@/views/AbstractMetaView";

@Options({
  components: {
    HelloWorld,
  },
})
export default class HomePage extends AbstractMetaView {}
