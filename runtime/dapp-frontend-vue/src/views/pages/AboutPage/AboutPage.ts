import { Options, Vue } from "vue-class-component";

@Options({
  methods: {
    pageName() {
      return "About";
    },
  },
})
export default class AboutPage extends Vue {}
