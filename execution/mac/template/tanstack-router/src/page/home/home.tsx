import { Link } from '@tanstack/react-router'
import { Heading } from '@/components/ui'
import { ja } from '@/shared/lang/ja'

function HomeLayout() {
  return (
    <main>
      <Heading>{ja.app.home.title}</Heading>

      <div>
        <Link to="/single-dynamic-fetch">
          {ja.app.home.toSingleDynamicPotter}
        </Link>
      </div>
    </main>
  )
}

export default HomeLayout
