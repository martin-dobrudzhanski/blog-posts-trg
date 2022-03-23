import Vue from 'vue'

Vue.directive('clickToToggle', {
    bind (el, binding, vnode) {
        el.addEventListener('click', function() {
            const target = document.querySelector("[data-target='expand-" + binding.value.target + "']")
            const targetIcon = document.querySelector("[data-target='expand-icon-" + binding.value.target + "']")

            target.classList.toggle('show');

            el.classList.toggle('show');

            targetIcon.src = el.classList.contains('show') ?
                require('../assets/img/icons/icon-minus.svg') :
                require('../assets/img/icons/icon-plus.svg')

        });
    }
})

Vue.directive('toggleTarget', {
    bind (el, binding, vnode) {
        el.dataset.target = `expand-${binding.value.target}`
    }
})

Vue.directive('toggleIcon', {
    bind (el, binding, vnode) {
        el.dataset.target = `expand-icon-${binding.value.target}`
    }
})


Vue.directive('fullScreen', {
	bind (el, binding, vnode) {
		if (binding.value === 'sm') {
			return;
		}
			const checkResponsiveClass  = () => {
				const screenHeight = window.innerHeight
				|| document.documentElement.clientHeight
				|| document.body.clientHeight;
				el.style.minHeight = screenHeight - 184 + 'px'
			}
			checkResponsiveClass()
			window.addEventListener('resize', checkResponsiveClass)
	}
})
