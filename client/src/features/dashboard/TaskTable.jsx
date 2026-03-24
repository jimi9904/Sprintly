import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask, deleteTask } from '../../redux/slices/taskSlice';
import { addActivity } from '../../redux/slices/activitySlice';
import { openTaskDrawer } from '../../redux/slices/uiSlice';
import {
    CheckCircle2,
    CircleDashed,
    Circle,
    CalendarDays,
    Flag,
    MessageSquare,
    Sparkles,
    UserPlus,
    Trash2,
    Calendar as CalendarIcon,
    ChevronDown,
    Plus,
    ChevronRight,
} from 'lucide-react';

const DatePopover = ({ task, onUpdate, menuRef }) => {
    const rawDate = task.dueDate ? new Date(task.dueDate) : new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date(rawDate.getFullYear(), rawDate.getMonth(), 1));

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

    const setDate = (d) => {
        if (!d || isNaN(d.getTime())) return; // Prevent crash on invalid date
        onUpdate(task._id, 'dueDate', d.toISOString());
    };

    const handleQuickDate = (type) => {
        const d = new Date();
        if (type === 'Tomorrow') d.setDate(d.getDate() + 1);
        else if (type === 'This weekend') d.setDate(d.getDate() + (6 - d.getDay()));
        else if (type === 'Next week') d.setDate(d.getDate() + (8 - d.getDay()));
        else if (type === 'Next weekend') d.setDate(d.getDate() + (13 - d.getDay()));
        else if (type === '2 weeks') d.setDate(d.getDate() + 14);
        else if (type === '4 weeks') d.setDate(d.getDate() + 28);
        setDate(d);
    };

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div ref={menuRef} className="absolute top-10 right-0 z-50 w-[550px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl flex animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            {/* Left Sidebar Options */}
            <div className="w-48 border-r border-stone-100 dark:border-stone-800 flex flex-col bg-stone-50/50 dark:bg-stone-900/50">
                <div className="p-2 flex-1 space-y-0.5 mt-2">
                    {[
                        { label: 'Today', day: new Date().toLocaleDateString('en-US', { weekday: 'short' }) },
                        { label: 'Tomorrow', day: new Date(Date.now() + 86400000).toLocaleDateString('en-US', { weekday: 'short' }) },
                        { label: 'This weekend', day: 'Sat' },
                        { label: 'Next week', day: 'Mon' },
                        { label: 'Next weekend', day: 'Sat' },
                        { label: '2 weeks', day: '' },
                        { label: '4 weeks', day: '' },
                    ].map((opt, i) => (
                        <button key={i} onClick={() => handleQuickDate(opt.label)} className="w-full flex justify-between items-center px-3 py-1.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-sm text-stone-700 dark:text-stone-300 transition-colors">
                            <span className="font-medium">{opt.label}</span>
                            <span className="text-xs text-stone-400 dark:text-stone-500">{opt.day}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Calendar Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-stone-900 rounded-r-xl overflow-hidden">
                <div className="p-2 border-b border-stone-100 dark:border-stone-800">
                    <div className="relative">
                        <CalendarIcon className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                        <input
                            type="date"
                            value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                                if (e.target.value) setDate(new Date(e.target.value));
                            }}
                            className="w-full bg-stone-50 dark:bg-[#111] text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:border-stone-300 dark:focus:border-stone-400 transition-colors"
                        />
                    </div>
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-stone-800 dark:text-stone-200">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                        <div className="flex gap-2 text-sm text-stone-500 dark:text-stone-400 items-center">
                            <button onClick={prevMonth} className="px-2 py-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded font-bold transition-colors">&lt;</button>
                            <button onClick={nextMonth} className="px-2 py-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded font-bold transition-colors">&gt;</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-y-2 text-center">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="text-xs text-stone-400 dark:text-stone-500 font-bold tracking-wider mb-2">{day}</div>
                        ))}
                        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                        {/* Calendar Grid */}
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                            const dateToRender = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                            const todayObj = new Date();
                            todayObj.setHours(0, 0, 0, 0);

                            const isPastDate = dateToRender < todayObj;
                            const isSelected = task.dueDate && rawDate.getDate() === day && rawDate.getMonth() === currentMonth.getMonth() && rawDate.getFullYear() === currentMonth.getFullYear();
                            const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth.getMonth() && new Date().getFullYear() === currentMonth.getFullYear();

                            return (
                                <button
                                    key={day}
                                    disabled={isPastDate}
                                    onClick={() => !isPastDate && setDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, 12))}
                                    className={`
                                        w-8 h-8 rounded-full flex items-center justify-center text-sm mx-auto transition-all font-medium
                                        ${isPastDate ? 'opacity-30 cursor-not-allowed text-stone-300 dark:text-stone-600' : 'hover:scale-110'}
                                        ${isSelected ? 'bg-primary-500 text-white font-bold disabled' :
                                            isToday && !isPastDate ? 'border border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20' :
                                                !isPastDate ? 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800' : ''}
                                    `}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TaskTable = ({ tasks }) => {
    const dispatch = useDispatch();
    const { teamMembers, user } = useSelector(state => state.auth);

    // UI State for popovers
    const [activeMenu, setActiveMenu] = useState({ type: null, taskId: null }); // type: 'assignee', 'date', 'status'
    const menuRef = useRef(null);

    // Group tasks by status
    const groupedTasks = useMemo(() => {
        const groups = {
            'todo': { label: 'TO DO', tasks: [], icon: CircleDashed, color: 'text-stone-500 dark:text-stone-400' },
            'in-progress': { label: 'IN PROGRESS', tasks: [], icon: Circle, color: 'text-blue-500' },
            'review': { label: 'REVIEW', tasks: [], icon: Sparkles, color: 'text-purple-500' },
            'done': { label: 'DONE', tasks: [], icon: CheckCircle2, color: 'text-emerald-500' }
        };

        tasks.forEach(task => {
            if (groups[task.status]) {
                groups[task.status].tasks.push(task);
            } else {
                groups['todo'].tasks.push(task);
            }
        });

        // Always show TO DO even if empty
        return Object.entries(groups).filter(([_, group]) => group.tasks.length > 0 || _ === 'todo');
    }, [tasks]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu({ type: null, taskId: null });
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const closeMenu = () => setActiveMenu({ type: null, taskId: null });
    const toggleMenu = (e, type, taskId) => {
        e.stopPropagation();
        if (activeMenu.type === type && activeMenu.taskId === taskId) {
            closeMenu();
        } else {
            setActiveMenu({ type, taskId });
        }
    };

    const handleUpdateTask = (taskId, field, value) => {
        dispatch(updateTask({
            id: taskId,
            taskData: { [field]: value }
        }));

        const task = tasks.find(t => t._id === taskId);
        if (task) {
            if (field === 'status') {
                dispatch(addActivity({
                    user: 'You',
                    action: value === 'done' ? 'completed' : `marked as ${value}`,
                    target: task.title
                }));
            } else if (field === 'priority') {
                dispatch(addActivity({
                    user: 'You',
                    action: `changed priority to ${value} for`,
                    target: task.title
                }));
            } else if (field === 'dueDate') {
                dispatch(addActivity({
                    user: 'You',
                    action: 'updated due date for',
                    target: task.title
                }));
            }
        }
        closeMenu();
    };

    const toggleAssignee = (e, task, member) => {
        e.stopPropagation();
        let newAssignees = [...(task.assignees || [])];
        const exists = newAssignees.find(a => a._id === member._id || a === member._id);

        if (exists) {
            newAssignees = newAssignees.filter(a => a._id !== member._id && a !== member._id);
            dispatch(addActivity({
                user: 'You',
                action: `removed ${member.name} from`,
                target: task.title
            }));
        } else {
            newAssignees.push(member);
            dispatch(addActivity({
                user: 'You',
                action: `assigned ${member.name} to`,
                target: task.title
            }));
        }
        handleUpdateTask(task._id, 'assignees', newAssignees);
    };

    const getPriorityIcon = (priority) => {
        const colors = { urgent: 'text-red-500', high: 'text-orange-500', medium: 'text-blue-500', low: 'text-stone-400' };
        return <Flag className={`w-4 h-4 ${colors[priority?.toLowerCase()] || 'text-stone-400'}`} />;
    };

    const StatusPill = ({ status, onClick }) => {
        const styles = {
            'todo': 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800',
            'in-progress': 'border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20',
            'review': 'border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20',
            'done': 'border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
        };
        const labels = { 'todo': 'TO DO', 'in-progress': 'IN PROGRESS', 'review': 'REVIEW', 'done': 'DONE' };
        const Icons = { 'todo': CircleDashed, 'in-progress': Circle, 'review': Sparkles, 'done': CheckCircle2 };
        const Icon = Icons[status] || CircleDashed;

        return (
            <button
                onClick={onClick}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-bold uppercase tracking-wider transition-colors ${styles[status]}`}
            >
                <Icon className="w-3.5 h-3.5" />
                {labels[status]}
            </button>
        );
    };

    const AssigneePopover = ({ task }) => (
        <div ref={menuRef} className="absolute top-10 left-0 z-50 w-56 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800">
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Assign members</p>
            </div>
            <div className="max-h-56 overflow-y-auto custom-scrollbar divide-y divide-stone-100 dark:divide-stone-800">
                {/* Current User */}
                {user && (
                    <label className={`flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-colors select-none
                        ${task.assignees?.some(a => a._id === user._id || a === user._id) ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-stone-50 dark:hover:bg-stone-800'}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-[10px] font-bold text-stone-700 dark:text-white shrink-0">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className={`flex-1 text-sm font-medium truncate ${task.assignees?.some(a => a._id === user._id || a === user._id) ? 'text-primary-600 dark:text-primary-400' : 'text-stone-700 dark:text-stone-300'}`}>
                            {user?.name} (Me)
                        </span>
                        <input
                            type="checkbox"
                            checked={!!task.assignees?.some(a => a._id === user._id || a === user._id)}
                            onChange={e => toggleAssignee(e, task, user)}
                            className="w-4 h-4 rounded accent-primary-500 cursor-pointer shrink-0"
                        />
                    </label>
                )}

                {/* Other Members */}
                {teamMembers?.filter(m => m._id !== user?._id).map(member => {
                    const isAssigned = !!task.assignees?.find(a => a._id === member._id || a === member._id);
                    return (
                        <label
                            key={member._id}
                            className={`flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-colors select-none
                                ${isAssigned ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-stone-50 dark:hover:bg-stone-800'}`}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${isAssigned ? 'bg-primary-500' : 'bg-gradient-to-br from-primary-400 to-primary-600'}`}>
                                {member.name.charAt(0)}
                            </div>
                            <span className={`flex-1 text-sm font-medium truncate ${isAssigned ? 'text-primary-600 dark:text-primary-400' : 'text-stone-700 dark:text-stone-300'}`}>
                                {member.name}
                            </span>
                            <input
                                type="checkbox"
                                checked={isAssigned}
                                onChange={e => toggleAssignee(e, task, member)}
                                className="w-4 h-4 rounded accent-primary-500 cursor-pointer shrink-0"
                            />
                        </label>
                    );
                })}

                {(!teamMembers || teamMembers.length === 0) && !user && (
                    <div className="px-3 py-4 text-xs text-stone-400 text-center italic">No team members</div>
                )}
            </div>
        </div>
    );



    const PriorityPopover = ({ task }) => (
        <div ref={menuRef} className="absolute top-8 right-0 z-50 w-36 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col py-1">
                {['low', 'medium', 'high', 'urgent'].map(p => (
                    <button
                        key={p}
                        onClick={() => handleUpdateTask(task._id, 'priority', p)}
                        className={`px-3 py-2 text-left text-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors capitalize flex items-center gap-2 ${task.priority?.toLowerCase() === p ? 'text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-900/10' : 'text-stone-700 dark:text-stone-300'}`}
                    >
                        {getPriorityIcon(p)}
                        <span>{p}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="w-full bg-white/40 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-t-0 border-b-0 border border-stone-200 dark:border-white/5 pb-2 min-h-[400px]">

            {/* Headers Configuration */}
            <div className="grid grid-cols-[30px_1fr_140px_120px_130px_130px_100px_40px] gap-2 px-6 py-3 border-b border-stone-200 dark:border-stone-800/60 bg-stone-50/50 dark:bg-[#111111]/50 text-[12px] font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400">
                <div className="flex items-center justify-center"></div>
                <div className="flex items-center">Name</div>
                <div className="flex items-center">Project</div>
                <div className="flex items-center">Assignee</div>
                <div className="flex items-center">Assigned Date</div>
                <div className="flex items-center">Due date</div>
                <div className="flex items-center">Priority</div>
                <div className="flex items-center justify-center"></div>
            </div>

            <div className="min-h-[300px]">
                {groupedTasks.map(([statusKey, group]) => (
                    <div key={statusKey} className="mb-4 pt-2">
                        {/* Group Header */}
                        <div className="flex items-center gap-2 px-6 py-2 text-xs font-bold uppercase tracking-wider">
                            <group.icon className={`w-3.5 h-3.5 ${group.color}`} />
                            <span className="text-stone-700 dark:text-stone-300">{group.label}</span>
                            <span className="text-stone-400 dark:text-stone-600 font-medium ml-1">{group.tasks.length}</span>
                        </div>

                        {/* Task Rows */}
                        <div className="divide-y divide-stone-100 dark:divide-stone-800/40">
                            {group.tasks.map(task => (
                                <div
                                    key={task._id}
                                    className="group grid grid-cols-[30px_1fr_140px_120px_130px_130px_100px_40px] gap-2 px-6 py-1.5 hover:bg-stone-50/80 dark:hover:bg-white/[0.02] transition-colors items-center text-sm"
                                >
                                    {/* Selection / Status circle */}
                                    <div className="flex items-center justify-center cursor-pointer" onClick={() => handleUpdateTask(task._id, 'status', task.status === 'done' ? 'todo' : 'done')} title="Mark as completed">
                                        {task.status === 'done' ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 transition-transform group-hover:scale-110" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border-2 border-stone-300 dark:border-stone-600 group-hover:border-emerald-500 flex items-center justify-center transition-colors">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Name */}
                                    <div
                                        className={`font-semibold text-[14px] cursor-pointer flex items-center truncate ${task.status === 'done' ? 'text-stone-400 dark:text-stone-600 line-through' : 'text-stone-800 dark:text-stone-200 hover:text-primary-500 transition-colors'}`}
                                        onClick={() => dispatch(openTaskDrawer(task._id))}
                                    >
                                        <span className="truncate">{task.title}</span>
                                    </div>

                                    {/* Project Cell */}
                                    <div className="flex items-center text-stone-500 dark:text-stone-400/80 text-[12px] font-medium truncate">
                                        <span className="truncate bg-stone-100 dark:bg-white/5 px-2 py-0.5 rounded border border-stone-200 dark:border-white/5">
                                            {task.project?.name || 'Standalone'}
                                        </span>
                                    </div>

                                    {/* Assignee Cell */}
                                    <div className="relative flex items-center">
                                        {task.assignees && task.assignees.length > 0 ? (
                                            <div
                                                className="flex -space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={(e) => toggleMenu(e, 'assignee', task._id)}
                                            >
                                                {task.assignees.map((assignee, i) => (
                                                    <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 dark:from-stone-700 dark:to-stone-800 border-2 border-white dark:border-[#111] flex items-center justify-center text-[9px] font-bold text-stone-600 dark:text-stone-300 shadow-sm" title={assignee.name || 'User'}>
                                                        {(assignee.name || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={(e) => toggleMenu(e, 'assignee', task._id)}
                                                className={`
                                                    w-6 h-6 flex items-center justify-center rounded-full border border-dashed transition-all
                                                    ${activeMenu.type === 'assignee' && activeMenu.taskId === task._id
                                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                                        : 'border-stone-300 dark:border-stone-600 text-stone-400 hover:border-primary-500 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400'}
                                                `}
                                            >
                                                <UserPlus className="w-3 h-3" />
                                            </button>
                                        )}
                                        {activeMenu.type === 'assignee' && activeMenu.taskId === task._id && (
                                            <AssigneePopover task={task} />
                                        )}
                                    </div>

                                    {/* Assigned Date Cell */}
                                    <div className="flex items-center text-stone-500 dark:text-stone-400 font-medium text-[13px]">
                                        {task.createdAt
                                            ? new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                            : 'N/A'}
                                    </div>

                                    {/* Due Date Cell */}
                                    <div className="relative flex items-center group/date">
                                        <button
                                            onClick={(e) => toggleMenu(e, 'date', task._id)}
                                            className={`
                                                flex items-center gap-2 px-2.5 py-1 rounded-md border text-stone-500 transition-all font-medium text-[13px]
                                                ${activeMenu.type === 'date' && activeMenu.taskId === task._id
                                                    ? 'border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800/50 text-stone-900 dark:text-stone-200 shadow-sm'
                                                    : task.dueDate
                                                        ? 'border-transparent text-stone-700 dark:text-stone-300 hover:border-stone-200 dark:hover:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/30'
                                                        : 'border-transparent border-dashed text-stone-400 hover:border-stone-300 dark:hover:border-stone-700 hover:text-stone-600 dark:hover:text-stone-300'}
                                            `}
                                        >
                                            <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate">
                                                {task.dueDate
                                                    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                    : 'Empty'}
                                            </span>
                                        </button>

                                        {activeMenu.type === 'date' && activeMenu.taskId === task._id && (
                                            <DatePopover task={task} onUpdate={handleUpdateTask} menuRef={menuRef} />
                                        )}
                                    </div>

                                    {/* Priority Cell */}
                                    <div className="flex items-center relative">
                                        <button
                                            onClick={(e) => toggleMenu(e, 'priority', task._id)}
                                            className="flex items-center gap-2 px-2 py-1 rounded-md border border-transparent hover:border-stone-200 dark:hover:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/30 text-stone-600 dark:text-stone-300 transition-all capitalize text-[13px] font-medium"
                                            title="Change Priority"
                                        >
                                            {getPriorityIcon(task.priority)}
                                            <span>{task.priority || 'None'}</span>
                                        </button>

                                        {activeMenu.type === 'priority' && activeMenu.taskId === task._id && (
                                            <PriorityPopover task={task} />
                                        )}
                                    </div>

                                    {/* Delete/Action Cell */}
                                    <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => dispatch(deleteTask(task._id))}
                                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                            title="Delete Task"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                ))}

                {/* Ghost Add Task Row */}
                <div className="grid grid-cols-[30px_1fr] gap-2 px-6 py-3 border-t border-stone-100 dark:border-stone-800/40 hover:bg-stone-50/50 dark:hover:bg-white/[0.02] transition-colors items-center text-sm cursor-pointer text-stone-500 dark:text-stone-400" onClick={() => document.dispatchEvent(new CustomEvent('open-add-task-modal'))}>
                    <div className="flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                    </div>
                    <div className="font-semibold">
                        Add Task
                    </div>
                </div>

                {tasks.length === 0 && (
                    <div className="p-8 text-center text-stone-500 dark:text-stone-400 text-sm border-t border-stone-100 dark:border-stone-800/40">
                        No tasks found. Click "Add Task" to begin.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskTable;
