import { useMemo, useState, type ChangeEvent, type ReactElement } from "react";

import {
  ArchiveIcon,
  CopyIcon,
  EyeIcon,
  MoreHorizontal,
  Trash2Icon,
} from "lucide-react";

import { FilterBar, PageHeader, StatusBadge } from "@/components/blocks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PROJECT_STATUS_BADGE_MAP } from "@/constants";

import { LISTING_PROJECTS } from "./ListingPreviewPage.data";
import { listingPreviewPageStyles as styles } from "./ListingPreviewPage.styles";

const PAGE_SIZE = 5;

const STATUS_OPTIONS = [
  { label: "All statuses", value: "all" },
  { label: "Planning", value: "Planning" },
  { label: "In progress", value: "In progress" },
  { label: "At risk", value: "At risk" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

const CLIENT_OPTIONS = [
  { label: "All clients", value: "all" },
  ...Array.from(new Set(LISTING_PROJECTS.map((project) => project.client))).map(
    (client) => ({ label: client, value: client }),
  ),
];

export const ListingPreviewPage = (): ReactElement => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewEmptyState, setPreviewEmptyState] = useState(false);
  const [page, setPage] = useState(1);

  const filteredProjects = useMemo(() => {
    if (previewEmptyState) return [];

    return LISTING_PROJECTS.filter((project) => {
      const matchesSearch = project.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;
      const matchesClient =
        clientFilter === "all" || project.client === clientFilter;
      return matchesSearch && matchesStatus && matchesClient;
    });
  }, [searchTerm, statusFilter, clientFilter, previewEmptyState]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / PAGE_SIZE),
  );
  const safePage = Math.min(page, totalPages);
  const pagedProjects = filteredProjects.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const allSelected =
    pagedProjects.length > 0 &&
    pagedProjects.every((project) => selectedIds.has(project.id));

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleClearFilters = (): void => {
    setSearchTerm("");
    setStatusFilter("all");
    setClientFilter("all");
    setPage(1);
  };

  const toggleSelectAll = (checked: boolean): void => {
    setSelectedIds((current) => {
      const next = new Set(current);
      pagedProjects.forEach((project) => {
        if (checked) {
          next.add(project.id);
        } else {
          next.delete(project.id);
        }
      });
      return next;
    });
  };

  const toggleSelectRow = (id: string, checked: boolean): void => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  return (
    <section className={styles.wrapper}>
      <PageHeader
        breadcrumbItems={[{ label: "Preview" }, { label: "Projects" }]}
        title="Projects"
        description="Every active engagement across our clients."
        actions={<Button>Add project</Button>}
      />

      <FilterBar
        search={{
          label: "Search projects",
          value: searchTerm,
          onChange: handleSearchChange,
        }}
        filters={[
          {
            label: "Status",
            options: STATUS_OPTIONS,
            value: statusFilter,
            onValueChange: (value) => {
              setStatusFilter(value);
              setPage(1);
            },
          },
          {
            label: "Client",
            options: CLIENT_OPTIONS,
            value: clientFilter,
            onValueChange: (value) => {
              setClientFilter(value);
              setPage(1);
            },
          },
        ]}
        onClear={handleClearFilters}
        extra={
          <div className={styles.emptyStateToggle}>
            <Switch
              id="preview-empty-state"
              checked={previewEmptyState}
              onCheckedChange={setPreviewEmptyState}
            />
            <label
              htmlFor="preview-empty-state"
              className={styles.emptyStateLabel}
            >
              Preview empty state
            </label>
          </div>
        }
      />

      <div className={styles.tableCard}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  aria-label="Select all projects on this page"
                  checked={allSelected}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className={styles.numericCell}>Budget</TableHead>
              <TableHead>Due date</TableHead>
              <TableHead className={styles.actionsCell}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className={styles.emptyCell}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>No projects found</EmptyTitle>
                      <EmptyDescription>
                        {previewEmptyState
                          ? "This is what the table looks like with no rows."
                          : "Try adjusting your search or filters, or clear them to see every project."}
                      </EmptyDescription>
                    </EmptyHeader>
                    {!previewEmptyState && (
                      <EmptyContent>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleClearFilters}
                        >
                          Clear filters
                        </Button>
                      </EmptyContent>
                    )}
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              pagedProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Checkbox
                      aria-label={`Select ${project.name}`}
                      checked={selectedIds.has(project.id)}
                      onCheckedChange={(checked: boolean) =>
                        toggleSelectRow(project.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell>
                    <div className={styles.ownerCell}>
                      <Avatar>
                        <AvatarFallback>{project.ownerInitials}</AvatarFallback>
                      </Avatar>
                      <span>{project.ownerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={PROJECT_STATUS_BADGE_MAP[project.status]}
                      label={project.status}
                    />
                  </TableCell>
                  <TableCell className={styles.numericCell}>
                    {project.budget}
                  </TableCell>
                  <TableCell>
                    <time dateTime={project.dueDate}>{project.dueDate}</time>
                  </TableCell>
                  <TableCell className={styles.actionsCell}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Actions for ${project.name}`}
                          >
                            <MoreHorizontal />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredProjects.length > 0 && (
        <div className={styles.paginationFooter}>
          <p className={styles.paginationSummary}>
            Showing {pagedProjects.length} of {filteredProjects.length} projects
          </p>
          <Pagination className={styles.pagination}>
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
        </div>
      )}
    </section>
  );
};
