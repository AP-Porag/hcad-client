import { AppShell } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import Header from "./Header"
import Navbar from "./Navbar"
import classes from "./css/App.module.css"

export default function App({ children }) {
  const [opened, { toggle }] = useDisclosure()

  const isNavbarCollapse = false

  return (
    <AppShell
      classNames={{
        root: classes.root,
        navbar: classes.navbar,
        header: classes.header,
        main: classes.main,
      }}
      navbar={{
        width: isNavbarCollapse ? 60 : 260,
        breakpoint: "md",
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Header opened={opened} toggle={toggle} />
      </AppShell.Header>

      <AppShell.Navbar data-collapsed={isNavbarCollapse}>
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}

