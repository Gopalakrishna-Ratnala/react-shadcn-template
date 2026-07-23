import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  AlertTriangleIcon,
  ArchiveIcon,
  CopyIcon,
  EyeIcon,
  FolderOpenIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";

import { FilterBar, PageHeader, StatusBadge } from "@/components/blocks";
import type { StatusBadgeTone } from "@/components/blocks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/constants";
import { useProjects } from "@/hooks/useProjects";
import type { ProjectStatus } from "@/types/project.types";

import {
  checkboxCellStyles,
  emptyStateContentStyles,
  ownerCellStyles,
  ownerNameStyles,
  pageStyles,
  paginationFooterStyles,
  paginationSummaryStyles,
  previewEmptyToggleStyles,
  rowActionsCellStyles,
  tableCardContentStyles,
  updatedCellStyles,
} from "./ListingPage.styles";
import type { ProjectClientFilterValue, ProjectStatusFilterValue } from "./types";

const PAGE_SIZE = 5;

const STATUS_META: Record<ProjectStatus, { tone: StatusBadgeTone; label: string }> = {
  "in-progress": { tone: "info", label: "In progress" },
  "in-review": { tone: "warning", label: "In review" },
  completed: { tone: "success", label: "Completed" },
  "on-hold": { tone: "muted", label: "On hold" },
  "at-risk": { tone: "destructive", label: "At risk" },
};

const STATUS_OPTIONS: { value: ProjectStatusFilterValue; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "in-progress", label: "In progress" },
  { value: "in-review", label: "In review" },
  { value: "completed", label: "Completed" },
  { value: "on-hold", label: "On hold" },
  { value: "at-risk", label: "At risk" },
];

const formatUpdatedAt = (isoDate: string): string =>
  new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export function ListingPage() {
  const { state } = useProjects();

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilterValue>("all");
  const [clientFilter, setClientFilter] = useState<ProjectClientFilterValue>("all");
  const [previewEmptyState, setPreviewEmptyState] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const projects = useMemo(() => (state.status === "success" ? state.data : []), [state]);

  const clientOptions = useMemo(() => {
    const uniqueClients = Array.from(new Set(projects.map((project) => project.clientName))).sort();
    return [
      { value: "all", label: "All clients" },
      ...uniqueClients.map((clientName) => ({ value: clientName, label: clientName })),
    ];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (previewEmptyState) return [];

    const query = searchValue.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesQuery =
        query.length === 0 ||
        project.name.toLowerCase().includes(query) ||
        project.clientName.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      const matchesClient = clientFilter === "all" || project.clientName === clientFilter;
      return matchesQuery && matchesStatus && matchesClient;
    });
  }, [projects, searchValue, statusFilter, clientFilter, previewEmptyState]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedProjects = filteredProjects.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const allOnPageSelected =
    pagedProjects.length > 0 && pagedProjects.every((project) => selectedIds.has(project.id));

  const toggleRow = (id: string, checked: boolean): void => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleAllOnPage = (checked: boolean): void => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      pagedProjects.forEach((project) => {
        if (checked) next.add(project.id);
        else next.delete(project.id);
      });
      return next;
    });
  };

  const handleClearFilters = (): void => {
    setSearchValue("");
    setStatusFilter("all");
    setClientFilter("all");
    setPreviewEmptyState(false);
    setPage(1);
  };

  return (
    <section className={pageStyles} aria-label="Projects listing">
      <PageHeader
        breadcrumbs={[{ label: "Divami", href: ROUTES.PREVIEW_LISTING }, { label: "Projects" }]}
        title="Projects"
        description="All active client engagements across the studio."
        action={
          <Link to={ROUTES.PREVIEW_FORM} className={buttonVariants({})}>
            Add new project
          </Link>
        }
      />

      <FilterBar
        searchValue={searchValue}
        onSearchChange={(value) => {
          setSearchValue(value);
          setPage(1);
        }}
        searchPlaceholder="Search projects or clients…"
        filters={[
          {
            id: "status",
            label: "Filter by status",
            placeholder: "Status",
            value: statusFilter,
            options: STATUS_OPTIONS,
            onValueChange: (value) => {
              setStatusFilter(value as ProjectStatusFilterValue);
              setPage(1);
            },
          },
          {
            id: "client",
            label: "Filter by client",
            placeholder: "Client",
            value: clientFilter,
            options: clientOptions,
            onValueChange: (value) => {
              setClientFilter(value);
              setPage(1);
            },
          },
        ]}
        onClear={handleClearFilters}
        extra={
          <label htmlFor="preview-empty-state" className={previewEmptyToggleStyles}>
            <Switch
              id="preview-empty-state"
              checked={previewEmptyState}
              onCheckedChange={setPreviewEmptyState}
            />
            Preview empty state
          </label>
        }
      />

      <Card>
        <CardContent className={tableCardContentStyles}>
          {state.status === "error" ? (
            <Empty className={emptyStateContentStyles}>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <AlertTriangleIcon />
                </EmptyMedia>
                <EmptyTitle>Couldn&apos;t load projects</EmptyTitle>
                <EmptyDescription>{state.message}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : state.status === "loading" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={checkboxCellStyles}>
                    <p className="sr-only">Select</p>
                  </TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className={rowActionsCellStyles}>
                    <p className="sr-only">Actions</p>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                  <TableRow key={`skeleton-row-${index}`}>
                    <TableCell colSpan={7}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : filteredProjects.length === 0 ? (
            <Empty className={emptyStateContentStyles}>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderOpenIcon />
                </EmptyMedia>
                <EmptyTitle>No projects found</EmptyTitle>
                <EmptyDescription>
                  Try adjusting your search or filters, or clear them to see every project.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button type="button" variant="outline" onClick={handleClearFilters}>
                  Clear filters
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={checkboxCellStyles}>
                    <Checkbox
                      aria-label="Select all projects on this page"
                      checked={allOnPageSelected}
                      onCheckedChange={(checked) => toggleAllOnPage(checked === true)}
                    />
                  </TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className={rowActionsCellStyles}>
                    <p className="sr-only">Actions</p>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Checkbox
                        aria-label={`Select ${project.name}`}
                        checked={selectedIds.has(project.id)}
                        onCheckedChange={(checked) => toggleRow(project.id, checked === true)}
                      />
                    </TableCell>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.clientName}</TableCell>
                    <TableCell className={ownerCellStyles}>
                      <Avatar size="sm">
                        <AvatarFallback>{project.ownerInitials}</AvatarFallback>
                      </Avatar>
                      <p className={ownerNameStyles}>{project.ownerName}</p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        tone={STATUS_META[project.status].tone}
                        label={STATUS_META[project.status].label}
                      />
                    </TableCell>
                    <TableCell className={updatedCellStyles}>
                      {formatUpdatedAt(project.updatedAt)}
                    </TableCell>
                    <TableCell className={rowActionsCellStyles}>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Actions for ${project.name}`}
                            >
                              <MoreHorizontalIcon />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem render={<Link to={ROUTES.PREVIEW_DETAILS} />}>
                            <EyeIcon />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CopyIcon />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ArchiveIcon />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive">
                            <Trash2Icon />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {state.status === "success" && filteredProjects.length > 0 && (
        <footer className={paginationFooterStyles}>
          <p className={paginationSummaryStyles}>
            Showing {pagedProjects.length} of {filteredProjects.length} projects
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    setPage((current) => Math.max(1, current - 1));
                  }}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={pageNumber === safePage}
                      onClick={(event) => {
                        event.preventDefault();
                        setPage(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    setPage((current) => Math.min(totalPages, current + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </footer>
      )}
    </section>
  );
}

export default ListingPage;
