"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  blockUsers,
  unblockUsers,
  deleteUsers,
} from "@/app/admin/actions/userActions";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  CircularProgress,
  Toolbar,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Stack,
  Fade,
  Button, // ✅ Added
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import GroupsIcon from "@mui/icons-material/Groups";

type User = {
  id: string;
  name: string;
  email: string;
  last_login: string | null;
  status: string;
};

const statusColor = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "blocked":
      return "error";
    case "pending":
      return "warning";
    default:
      return "default";
  }
};

export default function UserListPage() {
  const supabase = createClient();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchData = async () => {
    const { data: authData } = await supabase.auth.getUser();
    setCurrentUserId(authData?.user?.id ?? null);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("last_login", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
    } else {
      setUsers(data || []);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allSelected = users.length > 0 && selected.length === users.length;
  const someSelected = selected.length > 0 && selected.length < users.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(users.map((user) => user.id));
    }
  };

  const handleBlock = async () => {
    const res = await blockUsers(selected, currentUserId || undefined);
    if (res?.error) {
      alert("Failed to block users: " + res.error.message);
    } else {
      alert("Users blocked!");
      await fetchData();
      setSelected([]);

      if (res.signOutCurrentUser) {
        await supabase.auth.signOut();
        router.push("/auth/login");
      }
    }
  };

  const handleUnblock = async () => {
    const res = await unblockUsers(selected);
    if (res?.error) {
      alert("Failed to unblock users: " + res.error.message);
    } else {
      alert("Users unblocked!");
      await fetchData();
      setSelected([]);
    }
  };

  const handleDelete = async () => {
    const res = await deleteUsers(selected, currentUserId || undefined);
    if (res?.error) {
      alert("Failed to delete users: " + res.error.message);
    } else {
      alert("Users deleted!");
      await fetchData();
      setSelected([]);

      if (res.signOutCurrentUser) {
        await supabase.auth.signOut();
        router.push("/auth/login");
      }
    }
  };

  const TableToolbar = () => (
    <Toolbar
      sx={{
        display: "flex",
        justifyContent: "space-between",
        bgcolor: (theme) =>
          selected.length > 0 ? theme.palette.action.selected : "inherit",
        borderRadius: 1,
        mb: 1,
        transition: "background 0.2s",
      }}
      variant="dense"
    >
      <Typography variant="subtitle1" fontWeight={600}>
        {selected.length} selected
      </Typography>
      <Stack direction="row" spacing={1}>
        <Tooltip title="Block selected">
          <span>
            <IconButton
              color="warning"
              onClick={handleBlock}
              disabled={selected.length === 0}
            >
              <BlockIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Unblock selected">
          <span>
            <IconButton
              color="info"
              onClick={handleUnblock}
              disabled={selected.length === 0}
            >
              <LockOpenIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Delete selected">
          <span>
            <IconButton
              color="error"
              onClick={handleDelete}
              disabled={selected.length === 0}
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Toolbar>
  );

  return (
    <Fade in>
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          mt: 6,
          px: { xs: 1, sm: 3 },
        }}
      >
        <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <GroupsIcon color="primary" fontSize="large" />
            <Typography
              variant="h4"
              fontWeight={700}
              letterSpacing={-1}
              sx={{ flex: 1 }}
            >
              User Management
            </Typography>
            <Button onClick={handleLogout} color="inherit" variant="outlined">
              Logout
            </Button>
          </Stack>
          {loading ? (
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
              sx={{ py: 8 }}
            >
              <CircularProgress size={28} />
              <Typography variant="body1">Loading users...</Typography>
            </Stack>
          ) : users.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No users found.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Invite new users or check back later.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              {selected.length > 0 && <TableToolbar />}
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 48, pl: 1 }}>
                      <Checkbox
                        indeterminate={someSelected}
                        checked={allSelected}
                        onChange={handleSelectAll}
                        inputProps={{ "aria-label": "select all users" }}
                      />
                    </TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Last Login</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => {
                    const isSelected = selected.includes(user.id);
                    return (
                      <TableRow
                        key={user.id}
                        hover
                        selected={isSelected}
                        sx={{
                          cursor: "pointer",
                          bgcolor: isSelected
                            ? (theme) => theme.palette.action.selected
                            : "inherit",
                          "&:hover": {
                            bgcolor: (theme) => theme.palette.action.hover,
                          },
                          transition: "background 0.2s",
                        }}
                        onClick={() => handleSelect(user.id)}
                      >
                        <TableCell sx={{ width: 48, pl: 1 }}>
                          <Checkbox
                            checked={isSelected}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{
                              "aria-labelledby": `user-checkbox-${user.id}`,
                            }}
                            onChange={() => handleSelect(user.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={500}>
                            {user.name || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="text.secondary"
                            fontFamily="monospace"
                          >
                            {user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography color="text.secondary">
                            {user.last_login
                              ? new Date(user.last_login).toLocaleString()
                              : "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.status}
                            color={statusColor(user.status) as any}
                            variant="outlined"
                            size="small"
                            sx={{ textTransform: "capitalize" }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Fade>
  );
}
