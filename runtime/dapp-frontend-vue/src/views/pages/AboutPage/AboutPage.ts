import { Options } from "vue-class-component";
import { AbstractMetaView } from "@/views/AbstractMetaView";

@Options({
  methods: {
    pageName() {
      return "About";
    },
  },
})
export default class AboutPage extends AbstractMetaView {}
