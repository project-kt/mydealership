"use client";

import React, { ReactElement } from "react";

import { Box, Tabs, Text } from "@radix-ui/themes";
import PaymentSessions from "./_components/payment-sessions";

export default function ProfileDetails(): ReactElement {
  return (
    <Tabs.Root defaultValue="orders">
      <Tabs.List>
        <Tabs.Trigger value="account">Profile</Tabs.Trigger>
        <Tabs.Trigger value="orders">Orders</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>

      <Box px="4" pt="3" pb="2">
        <Tabs.Content value="account">
          <Text size="2">Account</Text>
        </Tabs.Content>

        <Tabs.Content value="orders">
          <Text size="2">
            <PaymentSessions />
          </Text>
        </Tabs.Content>

        <Tabs.Content value="settings">
          <Text size="2">Settings</Text>
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  );
}
