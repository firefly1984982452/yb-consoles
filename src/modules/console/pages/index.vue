<template>
<ul>
  <li class="item">
    <p>&nbsp;</p>
    <p>有伴智慧养老云平台</p>
  </li>
</ul>
</template>

<script>
import _menu from '@/components/_menu'

export default {
  created() {
    _menu.gotoDesktop(this, true);
  }
}
</script>
