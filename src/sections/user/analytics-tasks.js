import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';

// ----------------------------------------------------------------------

export default function UserProfileTasks({ title, subheader, list, ...other }) {
  const [selected, setSelected] = useState(['2']);

  const handleClickComplete = (taskId) => {
    const tasksCompleted = selected.includes(taskId)
      ? selected.filter((value) => value !== taskId)
      : [...selected, taskId];

    setSelected(tasksCompleted);
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      {list.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          checked={selected.includes(task.id)}
          onChange={() => handleClickComplete(task.id)}
        />
      ))}
    </Card>
  );
}

UserProfileTasks.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function TaskItem({ task, checked, onChange }) {
  const popover = usePopover();
  const navigate = useNavigate();

  const handleMarkComplete = () => {
    popover.onClose();
    console.info('MARK COMPLETE', task.id);
  };

  const handleShare = () => {
    popover.onClose();
    console.info('SHARE', task.id);
  };

  const handleEdit = () => {
    popover.onClose();
    console.info('EDIT', task.id);
  };

  const handleDelete = () => {
    popover.onClose();
    console.info('DELETE', task.id);
  };

  return (
    <>
      <Stack
        direction="row"
        sx={{
          pl: 2,
          pr: 1,
          py: 1,
          '&:not(:last-of-type)': {
            borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
          },
          ...(task?.status && {
            color: 'text.disabled',
            textDecoration: 'line-through',
          }),
        }}
      >
        <FormControlLabel
          control={<Checkbox checked={task?.status} onChange={onChange} disabled={task?.status} />}
          label={task.label}
          sx={{ flexGrow: 1, m: 0 }}
        />
        {task?.route && (
          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate(task.route)}
            disabled={checked}
          >
            Go
          </Button>
        )}
      </Stack>

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">
        <MenuItem onClick={handleMarkComplete}>
          <Iconify icon="eva:checkmark-circle-2-fill" />
          Mark Complete
        </MenuItem>

        <MenuItem onClick={handleEdit}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem onClick={handleShare}>
          <Iconify icon="solar:share-bold" />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}

TaskItem.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  task: PropTypes.object,
};
