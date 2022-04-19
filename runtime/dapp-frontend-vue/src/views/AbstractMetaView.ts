import { computed, inject } from "vue";
import { Vue, setup } from "vue-class-component";
import { useMeta } from "vue-meta";

export abstract class AbstractMetaView extends Vue {
  metaConfig: any = inject("metaConfig");
  meta = setup(() =>
    useMeta(computed(() => this.metaConfig[this.constructor.name]))
  );
}
