import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Image,
  Popover,
  Progress,
  Stack,
  Switch,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
  rem,
} from "@mantine/core"

import { Link, useLocation } from "react-router-dom";

import {
  ArrangeHorizontalSquare,
  ArrowRight2,
  DirectboxNotif,
  Home2,
  Layer,
  LinkSquare,
  SearchNormal1,
} from "iconsax-react"

// import { MantineLogoRounded } from "~/components/MantineLogoRounded"
// import ThemeSwitch from "../components/ThemeSwitch"
import useStore from "../../store/useStore";
import classes from "./css/Navbar.module.css"

export default function Navbar() {
  const { isNavbarCollapse, toggleNavbar } = useStore();
  const { pathname } = useLocation()

  return (
    <Stack
      className="hideScrollbar"
      style={{
        overflowY: "scroll",
        display: "flex",
      }}
      w="100%"
      justify="space-between"
      h="100%"
    >
      <Flex w="100%" gap={18} direction="column" align="start">
        {/* Header */}
        <Group
          w="100%"
          align="center"
          justify={isNavbarCollapse ? "center" : "space-between"}
        >
          <Flex align="center" gap={6}>
            {/* <MantineLogoRounded size={30} color="accent" /> */}
            {!isNavbarCollapse && (
              <Text className={classes.appTitle} fw={600}>
                Mantine
              </Text>
            )}
          </Flex>

          <Switch
            checked={!isNavbarCollapse}
            onChange={toggleNavbar}
            visibleFrom="md"
            styles={{
              root: { height: "100%" },
              body: { height: "100%" },
              track: {
                cursor: "pointer",
                height: "100%",
                minWidth: rem(26),
                width: rem(20),
              },
              thumb: {
                "--switch-track-label-padding": "-1px",
                height: "90%",
                width: rem(12),
                borderRadius: rem(3),
                insetInlineStart: "var(--switch-thumb-start, 1px)",
              },
            }}
            h={22}
            radius={4}
            defaultChecked
          />
        </Group>

        {/* Search */}
        {isNavbarCollapse ? (
          <Popover width={200} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <ActionIcon size={40} variant="subtle">
                <SearchNormal1 size={18} />
              </ActionIcon>
            </Popover.Target>

            <Popover.Dropdown>
              <TextInput
                w="100%"
                radius="md"
                leftSection={<SearchNormal1 size={18} />}
                placeholder="Search"
                classNames={{ input: classes.searchInput }}
                rightSection={
                  <Badge radius={4} size="xs" variant="light">
                    /
                  </Badge>
                }
              />
            </Popover.Dropdown>
          </Popover>
        ) : (
          <TextInput
            mt="md"
            w="100%"
            radius="md"
            leftSection={<SearchNormal1 size={18} />}
            placeholder="Search"
            classNames={{ input: classes.searchInput }}
            rightSection={
              <Badge radius={4} size="xs" variant="light">
                /
              </Badge>
            }
          />
        )}

        {/* Navigation */}
        <Flex
          w="100%"
          direction="column"
          align={isNavbarCollapse ? "center" : "start"}
          gap={14}
        >
          <Text className={classes.navTitle} fz={12} fw={500} tt="uppercase">
            {isNavbarCollapse ? "NAV" : "Navigation"}
          </Text>

          <Flex w="100%" gap={6} direction="column">
            {navlinks.map(({ id, icon: Icon, title, link }) => {
              const isActive = pathname === link

              return isNavbarCollapse ? (
                <Tooltip
                  key={id}
                  position="right"
                  transitionProps={{ transition: "rotate-right" }}
                  label={<Text fw={500} fz={13}>{title}</Text>}
                >
                  <Link
                    to={link}
                    className={classes.navlink}
                    data-active={isActive}
                    data-collapse={isNavbarCollapse}
                  >
                    <Icon size={18} variant={isActive ? "Bold" : "Bulk"} />
                  </Link>
                </Tooltip>
              ) : (
                <Link
                  key={id}
                  to={link}
                  className={classes.navlink}
                  data-active={isActive}
                  data-collapse={isNavbarCollapse}
                >
                  <Icon size={18} variant={isActive ? "Bold" : "Bulk"} />
                  <Text className={classes.nav_title}>{title}</Text>
                </Link>
              )
            })}
          </Flex>
        </Flex>

        <Divider w="100%" />
      </Flex>

      {/* Bottom Plan Section */}
      <Flex
        visibleFrom="md"
        hidden={isNavbarCollapse}
        direction="column"
        gap={14}
      >
        <Box className={classes.plan}>
          <Flex direction="column" align="center" gap={2}>
            <Box className={classes.planLogoContainer}>
              {/* <MantineLogoRounded color="accent" size={24} /> */}
            </Box>

            <Text fw={600} fz={13} c="white">
              View + Event Limit
            </Text>

            <Text fz={10} fw={500} c="white">
              {Number(225948).toLocaleString()}/
              {Number(500000).toLocaleString()} Monthly Limit
            </Text>

            <Progress
              w="100%"
              value={30}
              color="var(--mantine-color-orange-4)"
            />
          </Flex>

          <Flex direction="column" align="center" gap={10}>
            <Button className={classes.learnMore} radius="xl" fullWidth>
              <Text fw={500} fz={11}>
                Learn More
              </Text>
            </Button>

            <UnstyledButton className={classes.upgradePlan}>
              <Text fw={500} fz={11}>
                Upgrade Plan
              </Text>

              <ActionIcon size={30} bg="white" variant="subtle" radius="xl">
                <ArrowRight2 size={16} color="black" />
              </ActionIcon>
            </UnstyledButton>
          </Flex>
        </Box>

        {/* <ThemeSwitch /> */}
      </Flex>
    </Stack>
  )
}

const navlinks = [
  {
    id: 1,
    icon: Home2,
    title: "Dashboard",
    link: "/quick-dash",
  },
  {
    id: 2,
    icon: Layer,
    title: "CMS",
    link: "/quick-dash/cms",
  },
  {
    id: 3,
    icon: DirectboxNotif,
    title: "Forms",
    link: "/quick-dash/forms",
  },
  {
    id: 4,
    icon: LinkSquare,
    title: "Clicks",
    link: "/quick-dash/clicks",
  },
  {
    id: 5,
    icon: ArrangeHorizontalSquare,
    title: "Split Testing",
    link: "/quick-dash/split-testing",
  },
]