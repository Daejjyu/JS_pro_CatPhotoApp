const IMAGE_PATH_PREFIX = 'https://fe-dev-matching-2021-03-serverlessdeploymentbuck-t3kpj3way537.s3.ap-northeast-2.amazonaws.com/public'

export default function ImageView({ $app, initialState }) {
    this.state = initialState
    this.$target = document.createElement('div')
    this.$target.className = 'Modal ImageView'

    $app.appendChild(this.$target)

    this.$exitBtn = document.createElement('btn')
    this.$exitBtn.className = 'ExitBtn'
    this.$exitBtn.innerText = "닫기"

    this.setState = (nextState) => {
        this.state = nextState
        this.render()
    }

    this.render = () => {
        this.$target.innerHTML = `<div class="content">${this.state ? `<img src = "${IMAGE_PATH_PREFIX}${this.state}">` : ''}</div>`
        this.$target.appendChild(this.$exitBtn)
        this.$target.style.display = this.state ? 'block' : 'none'
    }

    this.$exitBtn.addEventListener('click', (e) => {
        this.setState()
    })
    window.addEventListener('keyup', (e) => {
        if (e.key == 'Escape')
            this.setState()
    })

    this.render()
}