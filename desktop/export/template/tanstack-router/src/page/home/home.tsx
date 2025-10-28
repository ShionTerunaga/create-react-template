import { Link } from '@tanstack/react-router'
import { Box, Heading } from '@/components/ui'
import { ja } from '@/shared/lang/ja'

function HomeLayout() {
  return (
    <Box as="main">
      <Heading>{ja.app.home.title}</Heading>

      <Box>
        <Link to="/single-dynamic-fetch">{ja.app.home.toCachePotter}</Link>
      </Box>
    </Box>
  )
}

export default HomeLayout
